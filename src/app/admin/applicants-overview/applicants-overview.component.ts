import { Component, OnDestroy } from '@angular/core';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { from, map, Observable, ReplaySubject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Application } from '@app/models/application.model';
import { AdminService } from '@app/admin/admin.service';
import { NgxModalService } from 'ngx-modalview';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '@app/core/user.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import {
  SelectApplicationComponent
} from '@app/admin/applicants-overview/select-application/select-application.component';

@Component({
  selector: 'ffn-applicants-overview',
  templateUrl: './applicants-overview.component.html',
  styleUrls: ['./applicants-overview.component.scss']
})
export class ApplicantsOverviewComponent implements OnDestroy{
  public uploading = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private destroyGetAll$!: ReplaySubject<boolean>;

  constructor(private adminService: AdminService, private modalService: NgxModalService,
              private afAuth: AngularFireAuth, private userService: UserService, private router: Router,
              private applicationCollectionService: ApplicationCollectionService) { }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if(this.destroyGetAll$) {
      this.destroyGetAll$.next(true);
      this.destroyGetAll$.complete();
    }
  }

  public uploadNewApplicants(event: Event, element: any) {
    // @ts-ignore
    const applicantsCsv = event?.target?.files[ 0 ];

    this.modalService.addModal(ConfirmComponent, {
      title: 'Upload new applicants?',
      message: 'Are you sure you want to upload new applicants? Present scores will be deleted and you will not be able to retrieve them.'
    }).subscribe(ok => {
      if(ok) {
        this.uploading = true;
        this.adminService.deleteApplicantsFromDB()
          .pipe(
            switchMap(() => this.adminService.getApplicantsFromCSV(applicantsCsv)),
            map(applicantDBOs => this.adminService.applicantsDBOtoApplication(applicantDBOs)),
            switchMap(applicants => this.openSelectUsersModal(applicants)),
            map(applicants => applicants.length > 0 ? applicants : throwError(() => new Error(`Canceled`))),
            switchMap(applicants => this.adminService.addApplicantsToDB(applicants as Application[])),
            switchMap(() => this.applicantsUploaded()),
            switchMap(() => this.userService.resetSubmitted())
          )
          .subscribe({
            next: () => { element.value = ''; this.uploading = false; },
            error: (error) => { console.error(error); element.value = ''; this.uploading = false; }
          });
      } else {
        element.value = '';
      }
    });
  }

  public openSelectUsersModal(applications: Application[]): Observable<Application[]> {
    return this.modalService.addModal(SelectApplicationComponent, { applications: applications });
  }

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  public reselectApplicants() {
    this.destroyGetAll$ = new ReplaySubject(1);
    this.applicationCollectionService.getAll()
      .pipe(
        takeUntil(this.destroyGetAll$),
        switchMap(applicants => this.openSelectUsersModal(applicants)),
        tap(() => {
          this.destroyGetAll$.next(true);
          this.destroyGetAll$.complete();
        }),
        switchMap(applicants => this.adminService.updateApplicantsToDB(applicants)))
      .subscribe();
  }

  private applicantsUploaded(): Observable<boolean> {
    return this.modalService.addModal(ConfirmComponent, {
      title: 'Applicants uploaded'
    })
  }

}
