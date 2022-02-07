import { NgModule } from '@angular/core';
import { AdminComponent } from '@app/admin/admin.component';
import { SharedModule } from '@app/shared/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { UserScoresOverviewComponent } from './user-scores-overview/user-scores-overview.component';



@NgModule({
  declarations: [
    AdminComponent,
    AddUserComponent,
    UserScoresOverviewComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AdminModule { }
