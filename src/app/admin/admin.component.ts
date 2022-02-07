import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AdminService } from '@app/admin/admin.service';
import { filter, from, Observable, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { user } from '@angular/fire/auth';
import { UserService } from '@app/core/user.service';
import { AppUser } from '@app/models/app-user';
import {
  OverallScoresModalComponent
} from '@app/shared/components/overall-scores-modal/overall-scores-modal.component';
import { AddUserComponent } from '@app/admin/add-user/add-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ffn-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public uploading = false;
  public users!: AppUser[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private adminService: AdminService, private simpleModalService: SimpleModalService,
              private afAuth: AngularFireAuth, private userService: UserService,
              private angularFireFunctions: AngularFireFunctions, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public uploadNewApplicants(event: Event, element: any) {
    // @ts-ignore
    const applicantsCsv = event?.target?.files[ 0 ];

    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Upload new applicants?',
      message: 'Are you sure you want to upload new applicants? Present scores will be deleted and you will not be able to retrieve them.'
    }).subscribe(ok => {
      if(ok) {
        this.uploading = true;
        this.adminService.deleteApplicantsFromDB()
          .pipe(
            switchMap(() => this.adminService.uploadFile(applicantsCsv, 'applicants.csv')),
            switchMap(link => this.adminService.addApplicantsToStorage(link)),
            switchMap(data => this.adminService.addApplicantsToDB(data.applicants)),
            switchMap(() => this.applicantsUploaded()),
            switchMap(() => this.userService.resetSubmitted()))
          .subscribe(() => {
            element.value = '';
            this.uploading = false;
          })
      } else {
        element.value = '';
      }
    });
  }

  public addNewUser() {
    this.simpleModalService.addModal(AddUserComponent).subscribe();
  }

  public updateUser(user: AppUser) {
    this.simpleModalService.addModal(AddUserComponent, { user: user }).subscribe();
  }

  public getAllUsers() {
    this.userService.getAllAssessors()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(users => this.users = users);
  }

  public deleteUser(user: AppUser) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Delete User',
      message: 'Are you sure you want to delete ' + user.name + '?'
    }).pipe(
        filter(ok => ok),
        switchMap(() => this.callDeleteUser(user.uid!)),
        switchMap(() => this.userService.delete(user)))
      .subscribe();
  }

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  private applicantsUploaded(): Observable<boolean> {
    return this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Applicants uploaded'
    })
  }

  private callDeleteUser(uid: string): Observable<any> {
    const callable = this.angularFireFunctions.httpsCallable('deleteUser');
    return callable({ uid } );
  }
}
