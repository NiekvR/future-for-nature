import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { OverallScoresModalComponent } from './components/overall-scores-modal/overall-scores-modal.component';
import { ApplicantListItemComponent } from '@app/shared/components/applicant-list-item/applicant-list-item.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import {
  ApplicantScoreOverviewComponent
} from './components/applicant-score-overview/applicant-score-overview.component';
import { TextSelectDirective } from '@app/shared/pipes/highlight-text.pipe';
import { SelectComponent } from './components/select/select.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgxPopperjsModule } from 'ngx-popperjs';



@NgModule({
  declarations: [
    SearchComponent,
    OverallScoresModalComponent,
    ApplicantListItemComponent,
    ConfirmComponent,
    ApplicantScoreOverviewComponent,
    TextSelectDirective,
    SelectComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    // @ts-ignore
    NgxPopperjsModule.forRoot({placement: 'bottom', trigger: 'click'}),
    AgGridModule
  ],
  exports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    SearchComponent,
    OverallScoresModalComponent,
    ApplicantListItemComponent,
    ConfirmComponent,
    ApplicantScoreOverviewComponent,
    TextSelectDirective,
    SelectComponent,
    AgGridModule,
    NgxPopperjsModule
  ]
})
export class SharedModule {
}
