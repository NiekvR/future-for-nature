import { Component, OnInit, ViewChild } from '@angular/core';
import { from, map, Observable, switchMap, take, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
  OverallScoresModalComponent
} from '@app/shared/components/overall-scores-modal/overall-scores-modal.component';
import { NgxModalService } from 'ngx-modalview';
import { FileImportComponent } from '@app/admin/crm/file-import/file-import.component';
import { CellClickedEvent, ColDef, FilterChangedEvent, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { RelationsCollectionService } from '@app/core/relations-collection.service';
import { EventInviteCollectionService } from '@app/core/event-invite-collection.service';
import { EventInvite, InviteType } from '@app/models/event-invite.model';
import { Event } from '@app/models/event.model';
import { EventInviteDSO } from '@app/models/event-invite-dso.model';
import { EventCollectionService } from '@app/core/event-collection.service';
import { Relation } from '@app/models/relation.model';
import { EventInviteData } from '@app/admin/crm/event-invite-data.model';
import { RegistrationCollectionService } from '@app/core/registration-collection.service';
import { InviteAction, InviteCategory, Registration } from '@app/models/event-registration.model';
import { RegistrationData } from '@app/admin/crm/registration-data.model';
import { FileExportService } from '@app/core/file-export.service';

@Component({
  selector: 'ffn-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit {
  // Each Column Definition results in one Column.
  public relationColumnDefs: ColDef[] = [
    { field: 'relationType', headerName: 'Type' },
    { field: 'relationStatus', headerName: 'Status' },
    { field: 'relationCode', headerName: 'Relation code'},
    { field: 'relationName', headerName: 'Relation name'},
    { field: 'visit_address', headerName: 'Visit address'},
    { field: 'visit_postcode', headerName: 'Visit postcode'},
    { field: 'visit_city', headerName: 'Visit city'},
    { field: 'visit_landcode', headerName: 'Visit landcode'},
    { field: 'post_address', headerName: 'Post addres'},
    { field: 'post_postcode', headerName: 'Post postcode'},
    { field: 'post_city', headerName: 'Post city'},
    { field: 'post_landcode', headerName: 'Post landcode'},
    { field: 'email', headerName: 'Email'},
    { field: 'email2', headerName: 'Email 2'},
    { field: 'phone', headerName: 'Phone number'},
    { field: 'phone2', headerName: 'Phone number 2'},
    { field: 'phone3', headerName: 'Phone number 3'},
    { field: 'website', headerName: 'Website'},
    { field: 'dayOfBirth', headerName: 'Day of birth'},
    { field: 'firstNames', headerName: 'First names'},
    { field: 'callSign', headerName: 'Call sign'},
    { field: 'infix', headerName: 'Infix'},
    { field: 'lastName', headerName: 'Last name'},
    { field: 'dietaryRequirements', headerName: 'Dietary requirements'},
    { field: 'dutchSalutation', headerName: 'Dutch salutation'},
    { field: 'dutchSalutation', headerName: 'English salutation'},
    { field: 'board', headerName: 'Board'},
    { field: 'team', headerName: 'Team'},
    { field: 'nsc', headerName: 'NSC'},
    { field: 'isc', headerName: 'ISC'},
    { field: 'rva', headerName: 'RVA'},
    { field: 'ffnFriend', headerName: 'FFN Friend'},
    { field: 'globeGuard', headerName: 'Globe Guard'},
    { field: 'winner', headerName: 'Winner'},
    { field: 'functionBusinessRelation', headerName: 'Function business relation'},
    { field: 'reasonNonActive', headerName: 'Reason non active'},
    { field: 'broughtInBy', headerName: 'Brought in by'},
    { field: 'oldDonors', headerName: 'Old donors'},
    { field: 'natureOrganisation', headerName: 'Nature organisation'},
    { field: 'extraFamilyInvite', headerName: 'Extra family invite'},
    { field: 'headBusinessRelation', headerName: 'Head business relation'},
    { field: 'ffnFriendCancelDate', headerName: 'FFN Friend cancel date'},
    { field: 'relationCodeBusinessRelation', headerName: 'Relation code business relation'},
    { field: 'nameBusinessRelation', headerName: 'Name Business Relation'},
    { field: 'relationCodeBusinessRelationExtra', headerName: 'Relation code business relation extra'},
    { field: 'nameBusinessRelationExtra', headerName: 'Name Business Relation Extra'},
    { field: 'note', headerName: 'Note'},
    { field: 'headFamilyCode', headerName: 'Head family code'},
    { field: 'headFamilieName', headerName: 'Head family name'},
  ];

  public registrationColumnDefs: ColDef[] = [
    { field: 'relationCode', headerName: 'Relation code' },
    { field: 'relationName', headerName: 'Relation name' },
    { field: 'event', headerName: 'Event' },
    { field: 'year', headerName: 'Year' },
    { field: 'action', headerName: 'Action'},
    { field: 'category', headerName: 'Category'},
    { field: 'persons', headerName: '# persons'},
    { field: 'registered', headerName: 'Registered', type: 'boolean'},
    { field: 'present', headerName: '# Present'},
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Data that gets displayed in the grid
  public relationData!: Relation[];
  public registrationData!: RegistrationData[];
  public events!: Event[];

  public filterModel!: { [key: string]: any };

  public apply = false;

  public tabs = [
    'Relations',
    'Registrations'
  ]

  public selectedTab = this.tabs[ 0 ];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private afAuth: AngularFireAuth, private router: Router, private modalService: NgxModalService,
              private relationsCollectionService: RelationsCollectionService, private eventCollectionService: EventCollectionService,
              private registrationCollectionService: RegistrationCollectionService, private fileExportService: FileExportService) { }

  ngOnInit(): void {
    this.relationsCollectionService.getLimitNumberOfItems(50)
      .pipe(
        take(1),
        tap(relations => {
          this.relationData = relations;
          this.relationData.sort((a, b) => {return a.relationCode - b.relationCode });
        }),
        switchMap(() => this.eventCollectionService.getAll().pipe(take(1))),
        tap(events => this.events = events),
        switchMap(() => this.registrationCollectionService.getLimitNumberOfItems(50).pipe(take(1))),
        tap(registrations => {
          this.registrationData = registrations.map(registration => this.mapInviteToRegistration(registration));
          this.registrationData.sort((a, b) => this.sortOnRelationCodeAndEvent(a, b));
        }))
      .subscribe()
  }

  public openFileImport() {
    this.modalService.addModal(FileImportComponent, {}).subscribe();
  }

  public createInviteCSV() {
    const lastTwoEvents = this.events.filter(event => event.year > 2021);
    this.fileExportService.downloadInviteCSV(this.registrationData, this.relationData, lastTwoEvents);
  }

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  // Example of consuming Grid Event
  // public onCellClicked( e: CellClickedEvent): void {
  //   console.log('cellClicked', e);
  // }
  // public onFilterChanged( e: FilterChangedEvent): void {
  //   console.log('filterChanged', e);
  //   console.log('RFilterModel', this.agGrid.api.getFilterModel());
  //   if(!this.apply) {
  //     this.filterModel = this.agGrid.api.getFilterModel();
  //     this.apply = true;
  //   }
  //   console.log(this.filterModel);
  // }

  public applyFilter() {
    this.agGrid.api.setFilterModel(this.filterModel);
  }

  // Example using Grid's API
  // public  clearSelection(): void {
  //   console.log('CLEAR')
  //   this.agGrid.api.clearRangeSelection();
  // }

  private sortOnRelationCodeAndEvent(a: RegistrationData, b: RegistrationData): number {
    return a.relationCode === b.relationCode ? a.year - b.year : a.relationCode - b.relationCode;
  }

  private mapInviteToRegistration(registration: Registration): RegistrationData {
    const event = this.events.find(event => event.uid === registration.event)!
    return {
      ...registration,
      relationName: this.relationData.find(relation => relation.relationCode === registration.relationCode)?.relationName,
      year: event?.year,
      event: event?.name
    }
  }

}
