import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppUser } from '@app/models/app-user';
import { filter, from, map, Observable, ReplaySubject, switchMap, take, takeUntil } from 'rxjs';
import { ConfirmComponent } from '@app/shared/components/confirm/confirm.component';
import { NgxModalService } from 'ngx-modalview';
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

  constructor(private modalService: NgxModalService,
              private afAuth: AngularFireAuth, private userService: UserService,
              private angularFireFunctions: AngularFireFunctions, private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  public addNewUser() {
    this.modalService.addModal(AddUserComponent).subscribe(() => this.getAllUsers());;
  }

  public updateUser(user: AppUser) {
    this.modalService.addModal(AddUserComponent, { user: user }).subscribe(() => this.getAllUsers());;
  }

  public getAllUsers() {
    this.userService.getAllAssessors()
      .pipe(
        take(1),
        map(users => users.sort((a,b) => (a.name > b.name) ? 1 : -1)))
      .subscribe(users => this.users = users);
  }

  public deleteUser(user: AppUser) {
    this.modalService.addModal(ConfirmComponent, {
      title: 'Delete User',
      message: 'Are you sure you want to delete ' + user.name + '?'
    }).pipe(
      filter(ok => ok),
      switchMap(() => this.callDeleteUser(user.uid!)),
      switchMap(() => this.userService.delete(user))
    )
      .subscribe(() => this.getAllUsers());
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
