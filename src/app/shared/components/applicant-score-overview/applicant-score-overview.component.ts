import { Component, Input, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { Score } from '@app/models/score.model';

@Component({
  selector: 'ffn-applicant-score-overview',
  templateUrl: './applicant-score-overview.component.html',
  styleUrls: ['./applicant-score-overview.component.scss']
})
export class ApplicantScoreOverviewComponent implements OnInit {

  @Input() applicants!: Application[];
  @Input() scores!: { [ id: string]: Score };

  constructor() { }

  ngOnInit(): void {
  }

}
