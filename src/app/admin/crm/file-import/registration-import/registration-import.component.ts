import { Component, OnInit } from '@angular/core';
import { NgxModalService } from 'ngx-modalview';
import { AdminService } from '@app/admin/admin.service';
import { map, switchMap, tap } from 'rxjs';
import { RegistrationDso } from '@app/models/registration-dso.model';
import { FileImportService } from '@app/core/file-import.service';
import { Event } from '@app/models/event.model';
import { EventCollectionService } from '@app/core/event-collection.service';

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

  constructor(private modalService: NgxModalService, private fileImportService: FileImportService,
              private adminService: AdminService, private eventCollectionService: EventCollectionService) { }

  ngOnInit(): void {
  }

  public saveFile(event: any) {
    this.file = event?.target?.files[ 0 ];
  }

  public close() {
    this.modalService.removeAll();
  }

  public upload() {
    if(!!this.eventName && !!this.year && !!this.file) {
      this.uploadFromCsv();
    } else {
      this.error = 'Fill in event information';
    }
  }

  public uploadFromCsv() {
    if(!this.uploading) {
      this.uploading = true;
      console.log('start', (!!this.file && !!this.eventName && !!this.year));
      this.eventCollectionService.add({ name: this.eventName, year: this.year })
        .pipe(
          tap(event => {
            console.log(event);
            this.event = event
          }),
          switchMap(() => this.adminService.getFromCSV<RegistrationDso>(this.file)),
          switchMap(registrationDsos => this.fileImportService.updateAllRegistrationRelations(registrationDsos)),
          switchMap(registrationDsos => this.fileImportService.importAllRegistrations(registrationDsos, this.event?.id!)))
        .subscribe(data => {
          console.log(data);
          this.numberOfRegistration = data.length + 1;
          this.uploading = false;
          //TODO add cancel to add relation, update upload proces
        });
    }
  }

}
