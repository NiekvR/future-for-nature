import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxModalComponent, NgxModalService } from 'ngx-modalview';
import { Application } from '@app/models/application.model';
import { Score } from '@app/models/score.model';
import { ScoreCategory } from '@app/models/score-category.model';
import { SCORE_CATEGORIES } from '@app/judge/score-categories';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { filter, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { UserService } from '@app/core/user.service';
import { AppUser } from '@app/models/app-user';


@Component({
  selector: 'ffn-overall-scores-modal',
  templateUrl: './overall-scores-modal.component.html',
  styleUrls: ['./overall-scores-modal.component.scss']
})
export class OverallScoresModalComponent
  extends NgxModalComponent<{ applicants: Application[], scores: { [ id: string]: Score } }, any>
  implements OnInit, OnDestroy {
  public applicants!: Application[];
  public scores!: { [ id: string]: Score };
  public readyToSubmit = false;
  public user!: AppUser;

  public categories: ScoreCategory[] = SCORE_CATEGORIES;

  private scoredApplicants = 0;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private modalService: NgxModalService, private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.getMySelf();
    this.getScoredApplicants();
    this.readyToSubmit = this.getSubmittedScoresForApplicants().length === this.scoredApplicants;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public submitScores() {
    this.modalService.addModal(ConfirmComponent, {
      title: 'Submit scores?',
      message: 'Are you sure you want to submit your scores?'
    })
      .pipe(
        filter(ok => ok),
        tap(user => this.user.submitted = true),
        switchMap(() => this.userService.update(this.user))
      )
      .subscribe();
  }

  private getSubmittedScoresForApplicants(): Score[] {
    return this.getScoresForApplicants()
      .filter(score => score.submitted || score.pristine || score.skipped)
  }

  private getMySelf() {
    this.userService.getMySelf()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.user = user);
  }

  private getScoredApplicants() {
    this.scoredApplicants = this.getScoresForApplicants().length;
  }

  private getScoresForApplicants(): Score[] {
    return Object.values(this.scores)
      .filter(score => this.applicants.map(applicant => applicant.id)
        .includes(score.applicationId));
  }
}
