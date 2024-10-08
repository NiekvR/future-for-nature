import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { from, map, ReplaySubject, takeUntil } from 'rxjs';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { Score } from '@app/models/score.model';
import { NgxModalService } from 'ngx-modalview';
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
  public SORT_OPTIONS = [ 'Id', 'First Name', 'Surname', 'Status', 'Favourite' ];
  public ASC_OPTIONS = [ 'Ascending', 'Descending' ];

  public applications!: Application[];
  public searchedApplications!: Application[];
  public selectedApplication: Application | null | undefined;

  public submittedScores: { [ id: string]: Score } = {};

  public statusSort: 'asc' | 'desc' | null = null;
  public filter = false;

  public option = this.SORT_OPTIONS[ 0 ];
  public order = this.ASC_OPTIONS[ 0 ];

  public percentageComplete = 0;

  private steps = TOUR_STEPS;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private applicationCollectionService: ApplicationCollectionService, private afAuth: AngularFireAuth,
              private scoreCollectionService: ScoreCollectionService, private modalService: NgxModalService,
              private router: Router, private shepherdService: ShepherdService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getApplications();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public selectApplicant(applicant: Application) {
    if(applicant.id !== this.selectedApplication?.id) {
      this.selectedApplication = null;
      this.cdRef.detectChanges();
      if (this.selectedApplication !== applicant) {
        this.selectedApplication = applicant;
      } else {
        this.selectedApplication = null;
      }
    }
  }

  public filterApplicationList(searchTerm: string) {
    this.searchedApplications = this.applications
      .filter(application => application.name.fullName.includes(searchTerm) || application.ffnId.includes(searchTerm));
    this.searchedApplications = this.sortApplicants(this.searchedApplications);
  }

  public openAllScores() {
    this.modalService.addModal(OverallScoresModalComponent, {
      applicants: this.applications,
      scores: this.submittedScores
    }).subscribe();
  }

  public logOff() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  public sortOnStar() {
    if(!this.statusSort) {
      this.filter = !this.filter;
    }
  }

  public selectOption() {
    this.sortApplicants(this.searchedApplications);
  }

  public selectSortOrder() {
    this.sortApplicants(this.searchedApplications);
  }

  public clearSort() {
    this.option = this.SORT_OPTIONS[ 0 ];
    this.order = this.ASC_OPTIONS[ 0 ];
    this.sortApplicants(this.searchedApplications);
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

  private sortOn(a: Application, b: Application): number {
    let sort!: number;
    switch (this.option) {
      case this.SORT_OPTIONS[ 0 ]:
        sort = this.order === this.ASC_OPTIONS[ 0 ] ? this.sortAscOnId(a, b) : this.sortDescOnId(a, b);
        break;
      case this.SORT_OPTIONS[ 1 ]:
        sort = this.order === this.ASC_OPTIONS[ 0 ] ? this.sortAscOnFirstName(a, b) : this.sortDescOnFirstName(a, b);
        break;
      case this.SORT_OPTIONS[ 2 ]:
        sort = this.order === this.ASC_OPTIONS[ 0 ] ? this.sortAscOnSurName(a, b) : this.sortDescOnSurName(a, b);
        break;
      case this.SORT_OPTIONS[ 3 ]:
        sort = this.order === this.ASC_OPTIONS[ 0 ] ? this.sortAscOnStatus(a, b) : this.sortDescOnStatus(a, b);
        break;
      case this.SORT_OPTIONS[ 4 ]:
        sort = this.order === this.ASC_OPTIONS[ 0 ] ? this.sortAscOnStar(a, b) : this.sortDescOnStar(a, b);
        break;
    }
    return sort!;
  }

  private getApplications() {
    this.applicationCollectionService.getAll()
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
        this.percentageComplete = Math.ceil(scores.filter(score => score.submitted || score.skipped).length / this.applications.length * 100);
      });
  }

  private sortApplicants(applicants: Application[]) {
    return applicants.sort((a, b) => this.sortOn(a, b))
  }

  private sortAscOnId(a: Application, b: Application): number {
    return (a.ffnId > b.ffnId) ? 1 : -1;
  }

  private sortDescOnId(a: Application, b: Application): number {
    return (a.ffnId > b.ffnId) ? -1 : 1;
  }

  private sortAscOnStatus(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreB?.submitted ? 1
      : scoreA?.submitted ? - 1 :
        scoreB?.skipped ? 1 :
          scoreA?.skipped ? -1 : 0;
  }

  private sortDescOnStatus(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreA?.submitted ? 1
      : scoreB?.submitted ? - 1 :
        scoreA?.skipped ? 1 :
          scoreB?.skipped ? -1 : 0;
  }

  private sortAscOnStar(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreB?.favourite ? 1
      : scoreA?.favourite ? - 1 :
        scoreA?.skipped ? 1 :
          scoreB?.skipped ? -1 : 0;
  }

  private sortDescOnStar(a: Application, b: Application): number {
    const scoreA = this.submittedScores[ a.id! ];
    const scoreB = this.submittedScores[ b.id! ]
    return scoreA?.favourite ? 1
      : scoreB?.favourite ? - 1 :
        scoreB?.skipped ? 1 :
          scoreA?.skipped ? -1 : 0;
  }

  private sortAscOnFirstName(a: Application, b: Application): number {
    return (a.name.firstName > b.name.firstName) ? 1 : -1;
  }

  private sortDescOnFirstName(a: Application, b: Application): number {
    return (a.name.firstName > b.name.firstName) ? -1 : 1;
  }

  private sortAscOnSurName(a: Application, b: Application): number {
    return (a.name.surName > b.name.surName) ? 1 : -1;
  }

  private sortDescOnSurName(a: Application, b: Application): number {
    return (a.name.surName > b.name.surName) ? -1 : 1;
  }
}
