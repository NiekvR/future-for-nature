import { Component } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { AdminService } from '@app/admin/admin.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Membership, ReasonNonActive, Relation, RelationStatus, RelationType } from '@app/models/relation.model';
import { RelationDso } from '@app/models/relation-dso.model';
import { DateService } from '@app/core/date.service';
import { Valuable } from '@app/admin/crm/file-import/valuable.model';
import { EMPTY, expand, from, map, Observable, of, reduce, switchMap, take, tap } from 'rxjs';
import { EventInviteDSO } from '@app/models/event-invite-dso.model';
import { EventInvite, InviteType } from '@app/models/event-invite.model';
import { Event } from '@app/models/event.model';
import { EventCollectionService } from '@app/core/event-collection.service';
import { EventInviteCollectionService } from '@app/core/event-invite-collection.service';
import { EventAttendanceDso } from '@app/models/event-attendance-dso.model';
import { DeregisteredType, EventAttendance, Placement } from '@app/models/event-attendance.model';
import { EventAttendanceCollectionService } from '@app/core/even-attendance-collection.service';
import { InviteCategory, Registration } from '@app/models/event-registration.model';
import { RegistrationCollectionService } from '@app/core/registration-collection.service';
import { FileImportService } from '@app/core/file-import.service';

@Component({
  selector: 'ffn-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent extends SimpleModalComponent<{ }, any> {
  public file!: File;

  public uploading = false;

  public selected: string | undefined;

  constructor(private simpleModalService: SimpleModalService, private adminService: AdminService, private db: AngularFirestore,
              private dateService: DateService, private eventCollectionService: EventCollectionService,
              private eventInviteCollectionService: EventInviteCollectionService,
              private eventAttendanceCollectionService: EventAttendanceCollectionService,
              private fileImportService: FileImportService) { super(); }

  public setSelected(value: string) {
    this.selected = value;
  }

  public uploadFromCsv() {
    if(!this.uploading) {
      this.uploading = true;
      this.adminService.getFromCSV<EventAttendanceDso>(this.file)
        .pipe(tap(inviteDsos => this.importAllEventAttendees(inviteDsos)))
        .subscribe(data => {
          console.log(data);
          this.uploading = false;
        });
    }
  }

  public upload() {
    if(!this.uploading) {
      this.uploading = true;
      this.mergeInvitesAndAttendance()
        .subscribe(data => {
          console.log('DONE');
          this.uploading = false;
        });
    }
  }

  private importAllEventInvites(eventInviteDSOs: EventInviteDSO[]) {
    let index = 0;
    this.eventCollectionService.getAll()
      .pipe(take(1))
      .subscribe(events => {
        eventInviteDSOs.forEach(eventInviteDSO => {
          const invite = this.inviteDsoToInvite(eventInviteDSO, events)
          console.log(invite);
          this.eventInviteCollectionService.add(invite).subscribe(() => console.log(++index));
        });
      });
  }

  private importAllEventAttendees(eventAttendanceDSOs: EventAttendanceDso[]) {
    let index = 0;
    this.eventCollectionService.getAll()
      .pipe(take(1))
      .subscribe(events => {
        eventAttendanceDSOs
          .filter(eventAttendanceDSO => eventAttendanceDSO.relatiecode.length > 0)
          .forEach(eventAttendanceDSO => {
            const attendance = this.attendanceDsoToAttendance(eventAttendanceDSO, events)
            console.log(attendance);
            this.eventAttendanceCollectionService.add(attendance).subscribe(() => console.log(++index));
          });
      });
  }

  private mergeInvitesAndAttendance(): Observable<Registration[]> {
    return this.eventInviteCollectionService.getAll()
      .pipe(
        take(1),
        switchMap(invites => this.combineInvitesAndAttendance(invites)),
        switchMap(object => this.eventInvitesToRegistrations(object.invites.slice(0, 5), object.attendance)))
  }

  private combineInvitesAndAttendance(eventInvites: EventInvite[]): Observable<{ invites: EventInvite[], attendance: EventAttendance[] }> {
    return this.eventAttendanceCollectionService.getAll()
      .pipe(take(1),map(attendances => { return { invites: eventInvites, attendance: attendances }}));
  }

  private eventInvitesToRegistrations(eventInvites: EventInvite[], eventAttendances: EventAttendance[]): Observable<Registration[]> {
    return this.fileImportService.eventInvitesToRegistrations(eventInvites, eventAttendances);
  }

  private updateRelations(): Observable<RelationDso[]> {
    const database:AngularFirestoreCollection<Relation> = this.db.collection('relations');
    let index = 0;
    return this.getRelationDSOFromDB()
      .pipe(
        take(1),
        tap(relationDsos => {
          relationDsos.forEach(relationDso => {
            const relation = this.relationDsoToRelation(relationDso);
            console.log(relation);
            database.add(relation).then(() => console.log(++index));
          })
      }))
  }

  private getRelationDSOFromDB(): Observable<RelationDso[]> {
    const databaseDSO:AngularFirestoreCollection<RelationDso> = this.db.collection('relation');
    return databaseDSO.valueChanges();
  }

  private inviteDsoToInvite(inviteDso: EventInviteDSO, events: Event[]): EventInvite {
    const invite: EventInvite = {
      relationCode: Number(inviteDso.relatiecode),
      event: events.find(event => event.name.toLowerCase() === inviteDso.event.toLowerCase())!.id!,
      type: this.stringToInviteType(inviteDso.soortuitnodiging),
      personsEvent: this.toNumber(inviteDso.aantalpersonenevent),
      personsDiner: this.toNumber(inviteDso.aantalpersonendiner),
    }
    return this.getValuable(invite);
  }

  private attendanceDsoToAttendance(attendanceDso: EventAttendanceDso, events: Event[]): EventAttendance {
    const invite: EventAttendance = {
      relationCode: Number(attendanceDso.relatiecode),
      event: events.find(event => event.name.toLowerCase() === attendanceDso.event.toLowerCase())!.id!,
      personsEvent: this.toNumber(attendanceDso.aantalpersonenevent),
      personsDiner: this.toNumber(attendanceDso.aantalpersonendiner),
      placement: this.stringToPlacement(attendanceDso.placering),
      deregistered: this.stringToDeregisteredType(attendanceDso),
      present: this.stringNumberToBoolean(attendanceDso.aanwezigopevent)
    }
    return this.getValuable(invite);
  }

  private relationDsoToRelation(relationDso: RelationDso): Relation {
    const relation: Relation = {
      relationType: this.stringToRelationType(relationDso.relatietype),
      relationStatus: this.stringToRelationStatus(relationDso.relatiestatus),
      relationCode: Number(relationDso.relatiecode),
      relationName: relationDso.relatienaam,
      visit_address: relationDso.bezoek_adres,
      visit_postcode: relationDso.bezoek_postcode,
      visit_city: relationDso.bezoek_plaats,
      visit_landcode: relationDso.bezoek_landcode,
      post_address: relationDso.post_adres,
      post_postcode: relationDso.post_postcode,
      post_city: relationDso.post_plaats,
      post_landcode: relationDso.post_landcode,
      email: relationDso.email,
      email2: relationDso.email2,
      phone: relationDso.telefoon,
      phone2: relationDso.telefoon2,
      phone3: relationDso.telefoon3,
      website: relationDso.website,
      dayOfBirth: this.toDate(relationDso.geboortedatum),
      firstNames: relationDso.voornamen,
      callSign: relationDso.roepnaam,
      infix: relationDso.tussenvoegsel,
      lastName: relationDso.achternaam,
      dietaryRequirements: relationDso.dieetwensen,
      dutchSalutation: relationDso.nederlandseaanhef,
      englishSalutation: relationDso.engelseaanhef,
      board: this.stringToMembership(relationDso.bestuur),
      team: this.stringToMembership(relationDso.team),
      nsc: this.stringToMembership(relationDso.nsc),
      isc: this.stringToMembership(relationDso.isc),
      rva: this.stringToMembership(relationDso.rva),
      ffnFriend: this.stringToMembership(relationDso.ffnfriend),
      globeGuard: this.stringToMembership(relationDso.globeguard),
      winner: this.toNumber(relationDso.winnaar),
      functionBusinessRelation: relationDso.functiezakenrelatie,
      reasonNonActive: this.stringNumberToReasonNonActive(relationDso.redennonactief),
      broughtInBy: relationDso.ingebrachtdoor,
      oldDonors: relationDso.groepouddonateurs.toLowerCase() === 'ja',
      natureOrganisation: this.stringNumberToBoolean(relationDso.natuurorganisatie),
      extraFamilyInvite: this.stringNumberToBoolean(relationDso.extrafamilieuitnodiging),
      headBusinessRelation: this.stringNumberToBoolean(relationDso.hoofdzakenrelatie),
      ffnFriendCancelDate: this.toDate(relationDso.ffnfriendopzegdatum),
      relationCodeBusinessRelation: this.toNumber(relationDso.relatiecodezakenrelatie),
      nameBusinessRelation: relationDso.naamzakenrelatie,
      relationCodeBusinessRelationExtra: this.toNumber(relationDso.relatiecodezakenrelatieextra),
      nameBusinessRelationExtra: relationDso.naamzakenrelatieextra,
      note: relationDso.notitie,
      iban: relationDso.iban,
      headFamilyCode: this.toNumber(relationDso.hoofdfamiliecode),
      headFamilieName: relationDso.hoofdfamilienaam
    }
    return this.getValuable(relation);
  }

  private stringToRelationType(type: string): RelationType {
    type = type.toLowerCase();
    return type === 'persoon' ? RelationType.personal :
      type === 'zakelijke relatie' ? RelationType.businessRelation :
      type === 'leverancier' ? RelationType.supplier : RelationType.unknown;
  }

  private stringToRelationStatus(status: string): RelationStatus {
    status = status.toLowerCase();
    return status === 'actief' ? RelationStatus.active : RelationStatus.nonActive;
  }

  private stringToMembership(term: string): Membership {
    let membership: Membership;
    switch (term.toLowerCase()) {
      case 'lid': membership = Membership.member; break;
      case 'actief': membership = Membership.member; break;
      case 'ja': membership = Membership.member; break;
      case 'oud gg': membership = Membership.retiredMember; break;
      case 'oud lid': membership = Membership.retiredMember; break;
      case 'oud team lid': membership = Membership.retiredMember; break;
      case 'voormalig': membership = Membership.retiredMember; break;
      case 'bestuur': membership = Membership.board; break;
      case 'erelid': membership = Membership.honoraryMember; break;
    }
    // @ts-ignore
    return membership;
  }

  private stringNumberToBoolean(num: string): boolean {
    return num !== '0';
  }

  private stringNumberToReasonNonActive(num: string): ReasonNonActive {
    let reason: ReasonNonActive;
    switch (num) {
      case '1': reason = ReasonNonActive.noContact; break;
      case '2': reason = ReasonNonActive.decedent; break;
    }
    // @ts-ignore
    return reason;
  }

  private toDate(date: string): Date | undefined {
    return date === 'NULL' ? undefined : this.dateService.toDate(date);
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

  private stringToInviteType(type: string): InviteType {
    type = type.toLowerCase();
    return type === 'vip' ? InviteType.vip :
      type === 'invite' ? InviteType.invite : InviteType.unknown;
  }

  private stringToDeregisteredType(attendanceDSO: EventAttendanceDso): DeregisteredType | undefined {
    return (attendanceDSO.afgemeldvoordefinitiefticket === '1' || attendanceDSO.afgemeldvoordefinitiefticket === '2') ?
      DeregisteredType.beforeTicket :
      (attendanceDSO.afgemeldnadefinitiefticket === '1' || attendanceDSO.afgemeldnadefinitiefticket === '2') ?
         DeregisteredType.afterTicket : undefined;
  }

  private stringToPlacement(placementString: string): Placement | undefined {

    let placement: Placement;
    switch (placementString.toLowerCase()) {
      case 'zaal': placement = Placement.hall; break;
      case 'op naam': placement = Placement.byName; break;
      case 'gereserveerd': placement = Placement.reserved; break;
    }
    // @ts-ignore
    return placement;
  }

}
