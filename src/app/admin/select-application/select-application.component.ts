import { Component, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';

@Component({
  selector: 'ffn-select-application',
  templateUrl: './select-application.component.html',
  styleUrls: ['./select-application.component.scss']
})
export class SelectApplicationComponent extends SimpleModalComponent<{ applications: Application[] }, Application[]> implements OnInit{

  public applications!: Application[];

  constructor(private simpleModalService: SimpleModalService) {
    super();
  }

  ngOnInit() {
    this.applications = this.applications.sort((a, b) => (a.ffnId > b.ffnId) ? 1 : -1);
  }

  public selectApplication(application: Application) {
    application.checked = application.checked === 'yes' ? 'no' : 'yes';
  }

  public cancel() {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Stop uploading new applicants?',
      message: 'Are you sure you want to cancel? These applicants won\'t be uploaded and can not be used.'
    }).subscribe(ok => {
      if(ok) {
        this.close();
      }
    });
  }

  public confirm() {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Are you sure?',
      message: 'Are you sure all selected applicants are open for scoring? After this step the applicants will be uploaded and visible for the jury.'
    }).subscribe(ok => {
      if(ok) {
        this.result = this.applications;
        this.close();
      }
    });
  }

}
