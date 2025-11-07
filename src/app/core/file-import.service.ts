import { Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, of, reduce, switchMap, take, tap } from 'rxjs';
import { InviteAction, InviteCategory, RegisteredCategory, Registration } from '@app/models/event-registration.model';
import { Valuable } from '@app/admin/crm/file-import/valuable.model';
import { RegistrationCollectionService } from '@app/core/registration-collection.service';
import { Registration2023Dso, RegistrationDso } from '@app/models/registration-dso.model';
import { Relation, RelationStatus } from '@app/models/relation.model';
import { RelationsCollectionService } from '@app/core/relations-collection.service';
import { RelationCodeCollectionService } from '@app/core/relation-code-collection.service';

@Injectable({
  providedIn: 'root'
})
export class FileImportService {
  private tempNewRegistrations: Registration[] | undefined;
  private tempUploads: any[] | undefined;
  private tempEventId: string | undefined;
  private tempRelationCode = 101672;

  constructor(private registrationCollectionService: RegistrationCollectionService,
              private relationsCollectionService: RelationsCollectionService,
              private relationCodeCollectionService: RelationCodeCollectionService) { }

  public importAllRegistrations(registrationDsos: RegistrationDso[], eventId: string) {
    this.tempUploads = registrationDsos;
    this.tempEventId = eventId;
    const count = registrationDsos.length;
    return this.iterateThroughObservables(this, this.importRegistration, count)
      .pipe(tap(() => { this.tempUploads = undefined; this.tempEventId = undefined }));
  }

  public updateAllRegistrationRelations(registrationDsos: RegistrationDso[]) {
    this.tempUploads = registrationDsos;
    const count = registrationDsos.length;
    return this.iterateThroughObservables(this, this.updateRelations, count)
      .pipe(tap(() => { this.tempUploads = undefined;}));
  }

  public getRegistrationsFromEvent(eventId: string, registration2023Dso: Registration2023Dso[]): Observable<{ registrationDsos: Registration2023Dso[], registrations: Registration[] }>  {
    return this.registrationCollectionService.getAllFromEvent(eventId)
      .pipe(map(registrations => { return { registrationDsos: registration2023Dso, registrations }}))
  }

  private importRegistration(newThis: this, index: number): Observable<Registration> {
    const registration = newThis.registrationDsoToRegistration(newThis.tempUploads![ index ]);
    return newThis.addRegistration(registration!);
  }

  private updateRelations(newThis: this, index: number): Observable<RegistrationDso> {
    const registrationDso = newThis.tempUploads![ index ];
    console.log(registrationDso, index, newThis.tempUploads);

    return newThis.isYes(registrationDso.import) ?
      !!registrationDso.code ?
        newThis.isRelation(registrationDso) : newThis.addRelation(registrationDso):
      of(registrationDso);
  }

  private isRelation(registrationDso: RegistrationDso): Observable<RegistrationDso> {
    return this.relationsCollectionService.getItemBasedOnRelationCode(this.toNumber(registrationDso.code)!)
      .pipe(
        take(1),
        switchMap(relation => !!relation ? this.updateRelation(relation, registrationDso) : this.addRelation(registrationDso)))
  }

  private iterateThroughObservables<T>(newThis: this, getDate: (newThis: this, index: number) => Observable<T>, count: number): Observable<T[]> {
    return new Observable(observer => {
      getDate(newThis, 0)
        .pipe(
          expand((data, i) => {
            console.log('Uploading ' + (i + 1));
            return (i + 1) < count ? getDate(newThis, i + 1) : EMPTY;
          }, 0),
          reduce((acc, data) => {
            acc.push(data);
            return acc;
          }, [] as T[]))
        .subscribe((people) => {
          observer.next(people);
          observer.complete();
        });
    });
  }

  private addRegistration(registration: Registration): Observable<Registration> {
    console.log(registration);
    return this.registrationCollectionService.add(registration).pipe(take(1));
  }

  private updateRegistration(registration: Registration): Observable<Registration> {
    return this.registrationCollectionService.update(registration).pipe(take(1));
  }

  private addRelation(registrationDso: RegistrationDso): Observable<RegistrationDso> {
    return this.relationsCollectionService.add(this.createRelation(registrationDso))
      .pipe(
        map(relation => {
          registrationDso.code = '' + relation.relationCode;
          return registrationDso
        })
      )
  }

  private createRelation(registrationDso: RegistrationDso): Relation {
    return  {
      relationStatus: RelationStatus.active,
      relationName: registrationDso.name,
      connection: registrationDso.connection,
      email: registrationDso.email
    }
  }

  private updateRelation(relation: Relation, registrationDso: RegistrationDso): Observable<RegistrationDso> {
    let relationChanged = this.updateRelationWithRegistrationData(registrationDso, relation);
    return relationChanged.changed ? this.relationsCollectionService.update(relationChanged.relation).pipe(map(() => registrationDso)) : of(registrationDso);

  }

  private updateRelationWithRegistrationData(registrationDso: RegistrationDso, relation: Relation): { relation: Relation, changed: boolean } {
    let changed = false;
    if(relation.email?.toLowerCase().trim() !== registrationDso.email.toLowerCase().trim()) {
      changed = true;
      relation.email2 = relation.email;
      relation.email = registrationDso.email;
    }
    if(relation.relationName.toLowerCase().trim() !== registrationDso.name.toLowerCase().trim()) {
      changed = true;
      relation.relationName = registrationDso.name;
    }
    if(relation.connection?.toLowerCase().trim() !== registrationDso.connection.toLowerCase().trim()) {
      changed = true;
      relation.connection = registrationDso.connection;
    }
    if(!!registrationDso.note) {
      changed = true;
      relation.note = relation.note + '\n'+ new Date().toString() + ':\n' + registrationDso.note
    }
    return { relation: relation, changed: changed}
  }

  private registrationDsoToRegistration(registrationDso: RegistrationDso): Registration {
    const registration: Registration = {
      event: this.tempEventId!,
      category: this.getInviteCategory(registrationDso.invitation),
      registered: this.isYes(registrationDso.registered),
      dinner: this.isYes(registrationDso.dinner),
      guestDiner: this.isYes(registrationDso.guestdinner),
    }
    if(!!registrationDso.code) {
      registration.relationCode = this.toNumber(registrationDso.code)!;
      registration.note = registrationDso.note;
    } else {
      registration.relationName = registrationDso.name;
      registration.note = registrationDso.note;
    }
    if(!!registrationDso.registered) {
      registration.registrationCategory = this.getRegisteredCategory(registrationDso.registered);
    }
    if(!!registrationDso.guest) {
      registration.guest = registrationDso.guest
    }

    return registration;
  }

  private registration2023DsoToRegistration(registrationDso: Registration2023Dso, relation: Relation | undefined): Registration {
    const registration = {
      relationCode: !!relation ? relation.relationCode : this.toNumber(registrationDso.code)!,
      event: this.tempEventId!,
      action: this.getInviteAction(registrationDso.invitetype),
      category: this.getInviteCategory(registrationDso.invitationcategory),
      persons: this.toNumber(registrationDso.nroftickets),
      registered: this.stringNumberToBoolean(registrationDso.registration),
      present: registrationDso.attended === '1' ? this.toNumber(registrationDso.nroftickets) : 0,
    }

    return this.getValuable(registration);
  }

  private registration2023DsoToRelation(registrationDso: Registration2023Dso): Relation | undefined {
    const registration = registrationDso.add === '1' ? {
      relationCode: ++this.tempRelationCode,
      relationStatus: RelationStatus.active,
      relationName: registrationDso.name,
      email: registrationDso.email
    } : undefined
    return !!registration ? this.getValuable(registration) : undefined;
  }

  private getInviteAction(inviteAction: string): InviteAction {
    let action: InviteAction;
    switch (inviteAction) {
      case 'Dinner': action = InviteAction.dinner; break;
      case 'Dinner +1': action = InviteAction.dinnerPlus; break;
      case 'Yes': action = InviteAction.yes; break;
      case 'VIP': action = InviteAction.vip; break;
      case 'VIP +1': action = InviteAction.vipPlus; break;
      case '?': action = InviteAction.doubt; break;
      case 'Normal': action = InviteAction.normal; break;
      case 'No initial invite': action = InviteAction.noInitialInvite; break;
    }
    return action!;
  }

  private getInviteCategory(inviteCategory: string): InviteCategory {
    let category: InviteCategory;
    switch (inviteCategory.toLowerCase().trim()) {
      case 'normal': category = InviteCategory.normal; break;
      case 'plus one': category = InviteCategory.normalPlus; break;
      case 'dinner': category = InviteCategory.dinner; break;
      case 'dinner +1': category = InviteCategory.dinnerPlus; break;
      case 'organization': category = InviteCategory.organization; break;
    }
    return category!;
  }

  private getRegisteredCategory(registeredCategory: string): RegisteredCategory {
    let category: RegisteredCategory;
    switch (registeredCategory.toLowerCase().trim()) {
      case 'yes': category = RegisteredCategory.yes; break;
      case 'canceled': category = RegisteredCategory.canceled; break;
      case 'unsubscribed': category = RegisteredCategory.unsubscribed; break;
      case 'unavailable': category = RegisteredCategory.unavailable; break;
      case 'hard bounce': category = RegisteredCategory.hardBounce; break;
      case 'soft bounce': category = RegisteredCategory.softBounce; break;
    }
    return category!;
  }

  private getValuable<
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends {},
    V = Valuable<T>,
  >(obj: T): V {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) =>
          !(
            (typeof v === 'string' && !v.length) ||
            v === null ||
            typeof v === 'undefined' ||
            v === 'NULL'
          ),
      ),
    ) as unknown as V;
  }

  private toNumber(value: string): number | undefined {
    return isNaN(+value) ? undefined : Number(value);
  }

  private isYes(value: string): boolean {
    return value.toLowerCase().trim() === 'yes';
  }

  private stringNumberToBoolean(num: string): boolean {
    return num === '1';
  }
}
