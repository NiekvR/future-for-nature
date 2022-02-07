import { Component, OnDestroy, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
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
  extends SimpleModalComponent<{ applicants: Application[], scores: { [ id: string]: Score } }, any>
  implements OnInit, OnDestroy {
  public applicants!: Application[];
  public scores!: { [ id: string]: Score };
  public readyToSubmit = false;
  public user!: AppUser;

  public categories: ScoreCategory[] = SCORE_CATEGORIES;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private simpleModalService: SimpleModalService, private userService: UserService) {
    super();
  }

  ngOnInit() {
    this.getMySelf();
    this.readyToSubmit = this.getSubmittedScoresForApplicants().length === this.applicants.length;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public submitScores() {
    this.simpleModalService.addModal(ConfirmComponent, {
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
    return Object.values(this.scores)
      .filter(score => this.applicants.map(applicant => applicant.id)
          .includes(score.applicationId))
      .filter(score => score.submitted)
  }

  private getMySelf() {
    this.userService.getMySelf()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.user = user);
  }
}
