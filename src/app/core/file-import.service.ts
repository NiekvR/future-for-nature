import { Injectable } from '@angular/core';
import { EventInvite, InviteType } from '@app/models/event-invite.model';
import { EventAttendance } from '@app/models/event-attendance.model';
import { EMPTY, expand, map, Observable, of, reduce, switchMap, take, tap } from 'rxjs';
import { InviteAction, InviteCategory, Registration } from '@app/models/event-registration.model';
import { Valuable } from '@app/admin/crm/file-import/valuable.model';
import { RegistrationCollectionService } from '@app/core/registration-collection.service';
import { AdminService } from '@app/admin/admin.service';
import { Registration2023Dso, RegistrationDso } from '@app/models/registration-dso.model';
import { Relation, RelationStatus, RelationType } from '@app/models/relation.model';
import { RelationsCollectionService } from '@app/core/relations-collection.service';

@Injectable({
  providedIn: 'root'
})
export class FileImportService {
  private tempInvites: EventInvite[] | undefined;
  private tempAttendance: EventAttendance[] | undefined;
  private tempRegistrations: Registration[] | undefined;
  private tempUploads: any[] | undefined;
  private tempEventId: string | undefined;
  private tempRelationCode = 101672;

  constructor(private registrationCollectionService: RegistrationCollectionService, private adminService: AdminService,
              private relationsCollectionService: RelationsCollectionService) { }

  public eventInvitesToRegistrations(eventInvites: EventInvite[], eventAttendances: EventAttendance[]): Observable<Registration[]> {
    this.tempInvites = eventInvites;
    this.tempAttendance = eventAttendances;
    const count = eventInvites.length;
    return this.iterateThroughObservables(this, this.getRegistrations, count)
      .pipe(tap(() => {
        this.tempInvites = undefined;
        this.tempAttendance = undefined;
      }));
  }

  public importAllRegistrations(registrationDsos: RegistrationDso[], eventId: string) {
    this.tempUploads = registrationDsos;
    this.tempEventId = eventId;
    const count = registrationDsos.length;
    return this.iterateThroughObservables(this, this.importRegistration, count)
      .pipe(tap(() => { this.tempUploads = undefined; this.tempEventId = undefined }));
  }

  public importAll2023Registrations(registrationDsos: Registration2023Dso[], eventId: string) {
    this.tempUploads = registrationDsos;
    this.tempEventId = eventId;
    const count = registrationDsos.length;
    return this.iterateThroughObservables(this, this.import2023Registration, count)
      .pipe(tap(() => { this.tempUploads = undefined; this.tempEventId = undefined }));
  }

  public changeAll2023Registrations(registrationDsos: Registration2023Dso[], registrations: Registration[]) {
    this.tempUploads = registrationDsos;
    this.tempRegistrations = registrations;
    const count = registrationDsos.length;
    return this.iterateThroughObservables(this, this.change2023Registration, count)
      .pipe(tap(() => { this.tempUploads = undefined; this.tempEventId = undefined }));
  }

  public getRegistrationDsoFromCSV(file: File, eventId: string): Observable<{ registrationDsos: RegistrationDso[], eventId: string }> {
    return this.adminService.getFromCSV<RegistrationDso>(file)
      .pipe(map(registrationDsos => { return { registrationDsos, eventId }}))
  }

  public getRegistration2023DsoFromCSV(file: File, eventId: string): Observable<{ registrationDsos: Registration2023Dso[], eventId: string }> {
    return this.adminService.getFromCSV<Registration2023Dso>(file)
      .pipe(
        map(registrationDsos => registrationDsos.filter((registrationDso => !!registrationDso.code && !!registrationDso.attended))),
        map(registrationDsos => { return { registrationDsos, eventId }}))
  }

  public getRegistrationsFromEvent(eventId: string, registration2023Dso: Registration2023Dso[]): Observable<{ registrationDsos: Registration2023Dso[], registrations: Registration[] }>  {
    return this.registrationCollectionService.getAllFromEvent(eventId)
      .pipe(map(registrations => { return { registrationDsos: registration2023Dso, registrations }}))
  }

  private importRegistration(newThis: this, index: number): Observable<Registration> {
    const registration = newThis.registrationDsoToRegistration(newThis.tempUploads![ index ]);
    return newThis.addRegistration(registration!);
  }

  private change2023Registration(newThis: this, index: number): Observable<Registration | undefined> {
    const registration = newThis.tempRegistrations!
        .find(reg => reg.relationCode === newThis.toNumber(newThis.tempUploads![ index ].code));

    if(registration) {
      registration.present = newThis.toNumber(newThis.tempUploads![index].attended);
    }
    return !!registration ? newThis.updateRegistration(registration!) : of(undefined);
  }

  private import2023Registration(newThis: this, index: number): Observable<Registration> {
    const relation = newThis.registration2023DsoToRelation(newThis.tempUploads![ index ])
    return newThis.addRelation(relation)
      .pipe(
        take(1),
        switchMap(relation => {
        const registration = newThis.registration2023DsoToRegistration(newThis.tempUploads![ index ], relation)
        return newThis.addRegistration(registration!)
      }));
  }

  private getRegistrations(newThis: this, index: number): Observable<Registration> {
    const registration = newThis.getRegistrationFromInvite(newThis.tempInvites!, newThis.tempAttendance!, index);
    return newThis.addRegistration(registration!);
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

  private getRegistrationFromInvite(eventInvites: EventInvite[], eventAttendances: EventAttendance[], i: number): Registration | undefined {
    const invite = eventInvites[ i ];
    let attendance: EventAttendance | undefined;
    if(!!invite) {
      attendance = eventAttendances
        .find(eventAttendance =>
          eventAttendance.relationCode === invite.relationCode && eventAttendance.event === invite.event);
    }

    return !!invite ? this.eventInviteToRegistration(invite, attendance) : undefined;
  }

  private eventInviteToRegistration(eventInvite: EventInvite, eventAttendance: EventAttendance | undefined): Registration {
    const registration = {
      relationCode: eventInvite.relationCode,
      event: eventInvite.event,
      category: this.inviteCategoryFromEventInvite(eventInvite),
      persons: eventInvite.personsEvent,
      registered: !!eventAttendance?.deregistered ? false : undefined,
      present: eventAttendance?.present ? eventAttendance?.personsEvent : 0
    };
    return this.getValuable(registration);
  }

  private inviteCategoryFromEventInvite(eventInvite: EventInvite): InviteCategory {
    let category = InviteCategory.unknown;
    if(eventInvite.type === InviteType.vip) {
      if(!!eventInvite.personsDiner && eventInvite.personsDiner > 0) {
        category = eventInvite.personsDiner === 1 ? InviteCategory.dinner : InviteCategory.dinnerPlus;
      } else {
        category = eventInvite.personsEvent === 1 ? InviteCategory.vip : InviteCategory.vipPlus
      }
    } else if (eventInvite.type === InviteType.invite) {
      category = InviteCategory.normal
    }
    return category
  }

  private addRegistration(registration: Registration): Observable<Registration> {
    return this.registrationCollectionService.add(registration).pipe(take(1));
  }

  private updateRegistration(registration: Registration): Observable<Registration> {
    return this.registrationCollectionService.update(registration).pipe(take(1));
  }

  private addRelation(relation: Relation | undefined): Observable<Relation | undefined> {
    return !!relation ? this.relationsCollectionService.add(relation).pipe(take(1)) : of(relation);
  }

  private registrationDsoToRegistration(registrationDso: RegistrationDso): Registration {
    return {
      relationCode: this.toNumber(registrationDso.relatiecode)!,
      event: this.tempEventId!,
      action: this.getInviteAction(registrationDso.actieuitnodiging),
      category: this.getInviteCategory(registrationDso.uitnodigingcategorie),
      persons: this.toNumber(registrationDso.aantalgeregistreerd),
      registered: this.isRegistered(registrationDso.geregistreerd),
      present: this.toNumber(registrationDso.aantalaanwezig)
    }
  }

  private registration2023DsoToRegistration(registrationDso: Registration2023Dso, relation: Relation | undefined): Registration {
    const registration = {
      relationCode: !!relation ? relation.relationCode : this.toNumber(registrationDso.code)!,
      event: this.tempEventId!,
      action: this.getInviteAction(registrationDso.invitetype),
      category: this.getInviteCategory(registrationDso.invitationcategory),
      persons: this.toNumber(registrationDso.nroftickets),
      registered: this.stringNumberToBoolean(registrationDso.registration),
      present: registrationDso.attended === '1' ? this.toNumber(registrationDso.nroftickets) : 0
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
    switch (inviteCategory) {
      case 'Dinner': category = InviteCategory.dinner; break;
      case 'Dinner+1': category = InviteCategory.dinnerPlus; break;
      case 'VIP': category = InviteCategory.vip; break;
      case 'VIP+1': category = InviteCategory.vipPlus; break;
      case 'Normal(no dinner no+1)': category = InviteCategory.normal; break;
      case 'Normal(no dinner no+1)+ outlook': category = InviteCategory.normal; break;
      case 'Normal(no dinner no+1)+ last min': category = InviteCategory.normal; break;
      case 'plus 1 (no dinner)': category = InviteCategory.normalPlus; break;
      case 'Globeguards': category = InviteCategory.globeguards; break;
      case 'Extra Batch': category = InviteCategory.extraBatch; break;
      case 'Opvulling/gids': category = InviteCategory.extra; break;
      case 'Geen email': category = InviteCategory.noEmail; break;
      case 'Organization': category = InviteCategory.organization; break;
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

  private isRegistered(value: string): boolean {
    return value.toLowerCase().trim() === 'ja';
  }

  private stringNumberToBoolean(num: string): boolean {
    return num === '1';
  }
}
