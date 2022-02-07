import { Component, Input, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Score } from '@app/models/score.model';
import { ScoreCategory } from '@app/models/score-category.model';
import { SCORE_CATEGORIES } from '@app/judge/score-categories';

@Component({
  selector: 'ffn-applicant-list-item',
  templateUrl: './applicant-list-item.component.html',
  styleUrls: ['./applicant-list-item.component.scss']
})
export class ApplicantListItemComponent implements OnInit {

  public faSignOutAlt = faSignOutAlt;

  @Input() applicant!: Application;
  @Input() score!: Score;
  @Input() applicantsList = true;

  public categories: ScoreCategory[] = SCORE_CATEGORIES;

  constructor() { }

  ngOnInit(): void {
  }

}
