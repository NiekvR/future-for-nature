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

  public sortedApplicants: Application[] = [];

  constructor() { }

  ngOnInit(): void {
    this.sortApplicantsByScore();
  }

  private sortApplicantsByScore() {
    this.sortedApplicants = this.sortedApplicants.concat(this.applicants);
    this.sortedApplicants = this.sortedApplicants
      .sort((a, b) =>
        (this.getTotalScoreForApplicant(b) - this.getTotalScoreForApplicant(a)));
  }

  private getTotalScoreForApplicant(applicant: Application): number {
    return !!this.scores[ applicant.id! ] ? Number(this.scores[ applicant.id! ]?.total) : 0;
  }

}
