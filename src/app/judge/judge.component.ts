import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { from, map, ReplaySubject, takeUntil } from 'rxjs';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { Score } from '@app/models/score.model';
import { SimpleModalService } from 'ngx-simple-modal';
import {
  OverallScoresModalComponent
} from '@app/shared/components/overall-scores-modal/overall-scores-modal.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ShepherdService } from 'angular-shepherd';
import { TOUR_STEPS } from '@app/tour-steps';

@Component({
  selector: 'ffn-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit, OnDestroy {

  public applications!: Application[];
  public searchedApplications!: Application[];
  public selectedApplication!: Application | null;

  public submittedScores: { [ id: string]: Score } = {};

  public statusSort: 'asc' | 'desc' | null = null;
  public starSort = false;

  private steps = TOUR_STEPS;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private applicationCollectionService: ApplicationCollectionService, private afAuth: AngularFireAuth,
              private scoreCollectionService: ScoreCollectionService, private simpleModalService: SimpleModalService,
              private router: Router, private shepherdService: ShepherdService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getApplications();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public selectApplicant(applicant: Application) {
    this.selectedApplication = null;
    this.cdRef.detectChanges();
    if (this.selectedApplication !== applicant) {
      this.selectedApplication = applicant;
    } else {
      this.selectedApplication = null;
    }
  }

  public filterApplicationList(searchTerm: string) {
    this.searchedApplications = this.applications
      .filter(application => application.name.fullName.includes(searchTerm) || application.ffnId.includes(searchTerm));
    this.searchedApplications = this.sortApplicants(this.searchedApplications);
  }

  public openAllScores() {
    this.simpleModalService.addModal(OverallScoresModalComponent, {
      applicants: this.applications,
      scores: this.submittedScores
    }).subscribe();
  }

  public logOff() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  public sortOnStatus() {
    if(!this.starSort) {
      switch (this.statusSort) {
        case 'asc':
          this.statusSort = 'desc';
          break;
        case 'desc':
          this.statusSort = null;
          break;
        case null:
          this.statusSort = 'asc';
          break;
      }
      this.searchedApplications = this.sortApplicants(this.searchedApplications);
    }
  }

  public sortOnStar() {
    if(!this.statusSort) {
      this.starSort = !this.starSort;
      this.searchedApplications = this.sortApplicantsOnStar(this.searchedApplications);
    }
  }

  public openTour() {
    this.shepherdService.defaultStepOptions = {
      classes: 'shepherd-ffn-theme'
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = true;
    // @ts-ignore
    this.shepherdService.addSteps(this.steps);
    this.shepherdService.start();
  }

  private getApplications() {
    this.applicationCollectionService.getAllSelectedApplications()
      .pipe(
        takeUntil(this.destroyed$),
        map(applicants => this.sortApplicants(applicants)))
      .subscribe(applications => {
        this.applications = applications;
        this.getScores();
      });
  }

  private getScores() {
    this.scoreCollectionService.getAllScoresForCurrentUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scores => {
        scores.forEach(score => this.submittedScores[ score.applicationId! ] = score);
        this.searchedApplications = this.sortApplicants(this.applications);
      });
  }

  private sortApplicants(applicants: Application[]) {
    return applicants.sort((a, b) => this.determineSortCriteria(a, b))
  }

  private sortApplicantsOnStar(applicants: Application[]) {
    return applicants.sort((a, b) => this.starSort ? this.sortAscOnStar(a, b) : (a.ffnId > b.ffnId) ? 1 : -1)
  }

  private determineSortCriteria(a: Application, b: Application): number {
    let score = 0;
    switch (this.statusSort) {
      case 'asc': score = this.sortAscOnStatus(a, b) ; break;
      case 'desc': score = this.sortDescOnStatus(a, b); break;
      case null: score = (a.ffnId > b.ffnId) ? 1 : -1; break;
    }
    return score;
  }

  private sortAscOnStatus(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreA?.submitted ? 1
      : scoreB?.submitted ? - 1 :
        scoreA?.skipped ? 1 :
          scoreB?.skipped ? -1 : 0;
  }

  private sortDescOnStatus(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreB?.submitted ? 1
      : scoreA?.submitted ? - 1 :
        scoreB?.skipped ? 1 :
          scoreA?.skipped ? -1 : 0;
  }

  private sortAscOnStar(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreB?.favourite ? 1
      : scoreA?.favourite ? - 1 :
        scoreA?.skipped ? 1 :
          scoreB?.skipped ? -1 : 0;
  }
}
