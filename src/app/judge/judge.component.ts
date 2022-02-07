import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'ffn-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit, OnDestroy {

  public applications!: Application[];
  public searchedApplications!: Application[];
  // public applications: Application[] = [
  //   {
  //     id: '1',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {
  //       'proposal': 'Bacon ipsum dolor amet buffalo tail sausage, corned beef turkey fatback chicken pastrami leberkas filet mignon. Brisket cupim beef ribs filet mignon. Buffalo venison short ribs alcatra ribeye swine beef ribs t-bone pancetta turducken shoulder frankfurter beef. T-bone spare ribs pork, ribeye beef ribs frankfurter doner prosciutto burgdoggen tenderloin. Porchetta shankle chislic, pork belly kevin pork bacon venison tail kielbasa beef ribs. Pork belly corned beef doner rump, pork picanha shank salami kevin leberkas. Jowl t-bone cow venison jerky leberkas capicola spare ribs ball tip strip steak.'
  //     }
  //   },
  //   {
  //     id: '2',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '3',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '4',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '5',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '6',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '7',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '8',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '9',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '10',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '11',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '12',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '13',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '14',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '15',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '16',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '17',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '18',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '19',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '20',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '21',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '22',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '23',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '24',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '25',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   },
  //   {
  //     id: '26',
  //     firstName: 'Test',
  //     lastName: 'Test',
  //     country: 'nl',
  //     data: {}
  //   }
  // ]

  public selectedApplication!: Application | null;
  // public selectedApplication: Application = {
  //   id: '1',
  //   firstName: 'Test',
  //   lastName: 'Test',
  //   country: 'nl',
  //   data: {
  //     'proposal': 'Bacon ipsum dolor amet buffalo tail sausage, corned beef turkey fatback chicken pastrami leberkas filet mignon. Brisket cupim beef ribs filet mignon. Buffalo venison short ribs alcatra ribeye swine beef ribs t-bone pancetta turducken shoulder frankfurter beef. T-bone spare ribs pork, ribeye beef ribs frankfurter doner prosciutto burgdoggen tenderloin. Porchetta shankle chislic, pork belly kevin pork bacon venison tail kielbasa beef ribs. Pork belly corned beef doner rump, pork picanha shank salami kevin leberkas. Jowl t-bone cow venison jerky leberkas capicola spare ribs ball tip strip steak.'
  //   }
  // };

  public submittedScores: { [ id: string]: Score } = {};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private applicationCollectionService: ApplicationCollectionService, private afAuth: AngularFireAuth,
              private scoreCollectionService: ScoreCollectionService, private simpleModalService: SimpleModalService,
              private router: Router) {}

  ngOnInit() {
    this.getApplications();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public selectApplicant(applicant: Application) {
    if (this.selectedApplication !== applicant) {
      this.selectedApplication = applicant;
    } else {
      this.selectedApplication = null;
    }
  }

  public filterApplicationList(searchTerm: string) {
    this.searchedApplications = this.applications.filter(application => application.name.fullName.includes(searchTerm))
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

  private getApplications() {
    this.applicationCollectionService.getAll()
      .pipe(
        takeUntil(this.destroyed$),
        map(applicants => applicants.sort((a, b) => (a.name.surName > b.name.surName) ? 1 : -1)))
      .subscribe(applications => {
        this.applications = this.searchedApplications = applications;
        this.getScores();
      });
  }

  private getScores() {
    this.scoreCollectionService.getAllScoresForCurrentUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(scores => scores.forEach(score => this.submittedScores[ score.applicationId! ] = score));
  }

}
