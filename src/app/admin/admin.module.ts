import { NgModule } from '@angular/core';
import { AdminComponent } from '@app/admin/admin.component';
import { SharedModule } from '@app/shared/shared.module';
import { AddUserComponent } from '@app/admin/manage-users/add-user/add-user.component';
import { UserScoresOverviewComponent } from '@app/admin/applicants-overview/user-scores-overview/user-scores-overview.component';
import { ApplicantsOverviewComponent } from '@app/admin/applicants-overview/applicants-overview.component';
import { ManageUsersComponent } from '@app/admin/manage-users/manage-users.component';
import { CardComponent } from './card/card.component';
import { CrmComponent } from './crm/crm.component';
import { FileImportComponent } from './crm/file-import/file-import.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationImportComponent } from './crm/file-import/attendance-import/registration-import.component';
import { PdfMergeComponent } from '@app/admin/pdf-merge/pdf-merge.component';


@NgModule({
  declarations: [
    AdminComponent,
    AddUserComponent,
    UserScoresOverviewComponent,
    ApplicantsOverviewComponent,
    ManageUsersComponent,
    CardComponent,
    CrmComponent,
    FileImportComponent,
    RegistrationImportComponent,
    PdfMergeComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule
  ]
})
export class AdminModule { }
