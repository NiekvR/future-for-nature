import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil, combineLatest, take, Observable, map } from 'rxjs';
import { AppUser } from '@app/models/app-user';
import { Score } from '@app/models/score.model';
import { UserService } from '@app/core/user.service';
import { Application } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { SCORE_CATEGORIES } from '@app/judge/score-categories';
import { ScoreCollectionService } from '@app/core/score-collection.service';


@Component({
  selector: 'ffn-user-scores-overview',
  templateUrl: './user-scores-overview.component.html',
  styleUrls: ['./user-scores-overview.component.scss']
})
export class UserScoresOverviewComponent implements OnInit, OnDestroy {

  public users!: AppUser[];
  public applicants!: Application[];
  public scores: { [userId: string]: { [applicantId: string]: Score } } = {};
  public totalScores: { [applicantId: string]: number } = {};
  public scoreCategories = SCORE_CATEGORIES;

  public selectedUser: AppUser | undefined;
  public userScores: { [ id: string]: Score } | undefined;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private userService: UserService, private applicationCollectionService: ApplicationCollectionService,
              private scoreCollectionService: ScoreCollectionService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getApplications();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public selectUser(user: AppUser) {
    this.selectedUser = user;
    this.userScores = this.scores[ user.uid! ];
  }

  public deselectUser() {
    this.selectedUser = undefined;
    this.userScores = undefined;
  }

  public desubmitScores() {
    this.selectedUser!.submitted = false;
    this.userService.update(this.selectedUser!).subscribe();
  }

  private getUsers() {
    this.userService.getAllAssessors()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(users => {
        this.users = users;
        this.getScores(users);
      });
  }

  private getApplications() {
    this.applicationCollectionService.getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(applicants => {
        this.applicants = applicants;
        this.getAverageScores(applicants);
      });
  }

  private getScores(users: AppUser[]) {
    users.forEach(user => this.scores[ user.uid! ] = {});
    return combineLatest(users.map(user => this.scoreCollectionService.getAllScoresForUser(user.uid!)))
      .pipe(take(1))
      .subscribe(userScores => {
        userScores.forEach(scores =>
          scores.forEach(score => this.scores[ score.userId ][ score.applicationId ] = score));
      })
  }

  private getAverageScores(applicants: Application[]) {
    return combineLatest(applicants.map(applicant =>
      this.getAllScoresForApplicant(applicant)))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scoresPerApplicant => {
          scoresPerApplicant.forEach(scores =>
            scores.scores.length > 0 ? this.totalScores[ scores.id ] = scores.scores
              .reduce((previousValue, score) => previousValue + +score.total, 0) : this.totalScores[ scores.id ] = 0);
          this.sortApplicantsOnAverageScores();
        });
  }

  private getAllScoresForApplicant(applicant: Application): Observable<{ scores: Score[], id: string }> {
    return this.scoreCollectionService.getAllScoresForApplicant(applicant.id!)
      .pipe(map(scores => { return { scores: scores, id: applicant.id! }}));
  }

  private sortApplicantsOnAverageScores() {
    this.applicants = this.applicants
      .sort((a, b) =>
        (this.getTotalScoreForApplicant(b) - this.getTotalScoreForApplicant(a)));
  }

  private getTotalScoreForApplicant(applicant: Application): number {
    return !!this.totalScores[ applicant.id! ] ? Number(this.totalScores[ applicant.id! ]) : 0;
  }


}
