import { Component, OnInit } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { AdminService } from '@app/admin/admin.service';
import { switchMap, take, tap } from 'rxjs';
import { RegistrationCollectionService } from '@app/core/registration-collection.service';
import { EventCollectionService } from '@app/core/event-collection.service';
import { RegistrationDso } from '@app/models/registration-dso.model';
import { Event } from '@app/models/event.model';
import { FileImportService } from '@app/core/file-import.service';

@Component({
  selector: 'ffn-attendance-import',
  templateUrl: './registration-import.component.html',
  styleUrls: ['./registration-import.component.scss']
})
export class RegistrationImportComponent implements OnInit {
  public file!: File;
  public eventName!: string;
  public year!: number;

  public error!: string | null;

  public uploading = false;

  constructor(private simpleModalService: SimpleModalService, private fileImportService: FileImportService,
              private eventCollectionService: EventCollectionService) { }

  ngOnInit(): void {
  }

  public saveFile(event: any) {
    this.file = event?.target?.files[ 0 ];
  }

  public close() {
    this.simpleModalService.removeAll();
  }

  public uploadFromCsv() {
    if(!this.uploading) {
      this.uploading = true;
      const event: Event = {
        name: this.eventName,
        year: this.year
      }
      this.eventCollectionService.get('TwUocYVmBgNqupRvHqrv')
        .pipe(
          take(1),
          switchMap(event => this.fileImportService.getRegistration2023DsoFromCSV(this.file, event.id!)),
          switchMap(data => this.fileImportService.getRegistrationsFromEvent(data.eventId, data.registrationDsos)),
          switchMap(data => this.fileImportService.changeAll2023Registrations(data.registrationDsos, data.registrations)))
        .subscribe(data => {
          console.log(data);
          this.uploading = false;
        });
    }
  }

}
