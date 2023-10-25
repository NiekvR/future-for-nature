import { Component } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { AdminService } from '@app/admin/admin.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Membership, ReasonNonActive, Relation, RelationStatus, RelationType } from '@app/admin/crm/relation.model';
import { RelationDso } from '@app/admin/crm/relation-dso.model';
import { DateService } from '@app/core/date.service';
import { Valuable } from '@app/admin/crm/file-import/valuable.model';
import { map, Observable, of, take, tap } from 'rxjs';

@Component({
  selector: 'ffn-file-import',
  templateUrl: './file-import.component.html',
  styleUrls: ['./file-import.component.scss']
})
export class FileImportComponent extends SimpleModalComponent<{ }, any> {
  private file!: File;

  public uploading = false;

  constructor(private simpleModalService: SimpleModalService, private adminService: AdminService, private db: AngularFirestore,
              private dateService: DateService) { super(); }

  public saveFile(event: any) {
    console.log(event);
    this.file = event?.target?.files[ 0 ];
    console.log(this.file);
  }

  public upload() {
    if(!this.uploading) {
      this.uploading = true;
      this.updateRelations()
        .subscribe(data => {
          this.uploading = false;
        });
    }
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
    return num === '1';
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

}
