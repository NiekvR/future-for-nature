import { Component, OnDestroy } from '@angular/core';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { from, map, Observable, ReplaySubject, switchMap, throwError } from 'rxjs';
import { Application } from '@app/models/application.model';
import { AdminService } from '@app/admin/admin.service';
import { NgxModalService } from 'ngx-modalview';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '@app/core/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'ffn-applicants-overview',
  templateUrl: './applicants-overview.component.html',
  styleUrls: ['./applicants-overview.component.scss']
})
export class ApplicantsOverviewComponent implements OnDestroy{
  public uploading = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private destroyGetAll$!: ReplaySubject<boolean>;

  constructor(private adminService: AdminService, private modalService: NgxModalService, private location: Location,
              private afAuth: AngularFireAuth, private userService: UserService, private router: Router) { }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    if(this.destroyGetAll$) {
      this.destroyGetAll$.next(true);
      this.destroyGetAll$.complete();
    }
  }

  public back() {
    this.location.back();
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

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  private applicantsUploaded(): Observable<boolean> {
    return this.modalService.addModal(ConfirmComponent, {
      title: 'Applicants uploaded'
    })
  }

}
