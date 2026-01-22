import { Component, OnInit } from '@angular/core';
import { NgxModalService } from 'ngx-modalview';
import { AdminService } from '@app/admin/admin.service';
import {map, Subject, switchMap, takeUntil, tap} from 'rxjs';
import { RegistrationDso } from '@app/models/registration-dso.model';
import { FileImportService } from '@app/core/file-import.service';
import { Event } from '@app/models/event.model';
import { EventCollectionService } from '@app/core/event-collection.service';
import {RelationsCollectionService} from "@app/core/relations-collection.service";

@Component({
  selector: 'ffn-registration-import',
  templateUrl: './registration-import.component.html',
  styleUrls: ['./registration-import.component.scss']
})
export class RegistrationImportComponent implements OnInit {
  public file!: File;
  public eventName!: string;
  public year!: number;

  public error!: string | null;

  public event: Event | undefined;
  public uploading = false;
  public uploaded = false;
  public numberOfRegistration = 0;
  public wrongHeaders: string[] = [];

  private registrationHeaders = [
    'Code',
    'Name',
    'Connection',
    'Email',
    'Invitation',
    'Registered',
    'Guest',
    'Dinner',
    'Guest Dinner',
    'Import',
    'Note'
  ]

  constructor(private modalService: NgxModalService, private fileImportService: FileImportService,
              private adminService: AdminService, private eventCollectionService: EventCollectionService, private relationsCollectionService: RelationsCollectionService) { }

  ngOnInit(): void {
  }

  public saveFile(event: any) {
    this.file = event?.target?.files[ 0 ];
  }

  public close() {
    this.modalService.removeAll();
  }

  public upload() {
    console.log(this.file.name.split('.').pop());
    if(!!this.eventName && !!this.year && !!this.file && this.file.name.split('.').pop() === 'csv') {
      this.uploadFromCsv();
    } else {
      this.error = 'Fill in event information or correct file type';
    }
  }

  public uploadFromCsv() {
    if(!this.uploading) {
      this.wrongHeaders = [];
      const stopSignal$ = new Subject();
      this.uploading = true;
      console.log('start', (!!this.file && !!this.eventName && !!this.year));
      this.eventCollectionService.add({ name: this.eventName, year: this.year })
        .pipe(
          tap(event => {
            console.log(event);
            this.event = event
          }),
          switchMap(() => this.adminService.getHeadersFromCSV(this.file)),
          map(headers => {
            const hasCorrectHeaders = this.hasCorrectHeaders(headers);
            if (!hasCorrectHeaders) {
              this.error = 'The following headers are not correct: ' + this.wrongHeaders.join(', ') + '. Please fix them in your CSV file. These are correct: ' + this.registrationHeaders.join(', ');
              stopSignal$.next(1);
            }
            return headers;
          }),
          switchMap(() => this.adminService.getFromCSV<RegistrationDso>(this.file)),
          tap(registrationDso => console.log(registrationDso)),
          map(registrationDsos => registrationDsos.filter(registrationDso => this.hasData(registrationDso))),
          switchMap(registrationDsos => this.fileImportService.updateAllRegistrationRelations(registrationDsos)),
          switchMap(registrationDsos => this.fileImportService.importAllRegistrations(registrationDsos, this.event?.id!)),
          takeUntil(stopSignal$))
        .subscribe(data => {
          console.log(data);
          this.numberOfRegistration = data.length + 1;
          this.uploading = false;
          //TODO add cancel to add relation, update upload proces
        });
    }
  }

  public hasData(registrationDso:RegistrationDso): boolean {
    return !!registrationDso.name &&
      registrationDso.name.length > 0 &&
      !!registrationDso.email &&
      registrationDso.email.length > 0 &&
      !!registrationDso.invitation &&
      registrationDso.invitation.length > 0;
  }

  private hasCorrectHeaders(headers: string[]): boolean {
    let hasCorrectHeader = headers.length === this.registrationHeaders.length;
    headers.forEach(header => {
      if(!this.registrationHeaders.includes(header.trim())) {
        hasCorrectHeader = false;
        this.wrongHeaders.push(header);
      }
    })
    return hasCorrectHeader;
  }

}
