import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { OverallScoresModalComponent } from './components/overall-scores-modal/overall-scores-modal.component';
import { ApplicantListItemComponent } from '@app/shared/components/applicant-list-item/applicant-list-item.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ApplicantScoreOverviewComponent } from './components/applicant-score-overview/applicant-score-overview.component';



@NgModule({
  declarations: [
    SearchComponent,
    OverallScoresModalComponent,
    ApplicantListItemComponent,
    ConfirmComponent,
    ApplicantScoreOverviewComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    SearchComponent,
    OverallScoresModalComponent,
    ApplicantListItemComponent,
    ConfirmComponent,
    ApplicantScoreOverviewComponent
  ]
})
export class SharedModule { }
