import { Component, OnInit } from '@angular/core';
import { AppUser } from '@app/models/app-user';
import { filter, from, Observable, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { AdminService } from '@app/admin/admin.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '@app/core/user.service';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { AddUserComponent } from '@app/admin/manage-users/add-user/add-user.component';

@Component({
  selector: 'ffn-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  public users!: AppUser[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private adminService: AdminService, private simpleModalService: SimpleModalService,
              private afAuth: AngularFireAuth, private userService: UserService,
              private angularFireFunctions: AngularFireFunctions, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
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

  private callDeleteUser(uid: string): Observable<any> {
    const callable = this.angularFireFunctions.httpsCallable('deleteUser');
    return callable({ uid } );
  }

}
