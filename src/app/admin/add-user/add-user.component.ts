import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { UserService } from '@app/core/user.service';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AppUser } from '@app/models/app-user';

@Component({
  selector: 'ffn-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent extends SimpleModalComponent<{}, any> implements OnInit{
  public email!: string;
  public name!: string;
  public user!: AppUser;

  public error!: string;

  constructor(private afAuth: AngularFireAuth, private userService: UserService, private angularFireFunctions: AngularFireFunctions) {
    super();
  }

  ngOnInit() {
    this.setUp();
  }

  public confirm() {
    const observable = !!this.user ? this.updateUser() : this.createNewUser();

    observable.subscribe({
        next: () => {
          this.result = true;
          this.close();
        },
        error: () => {
          this.error = 'De gebruikersnaam is al bekend.'
        }
      });
  }



  private setUp() {
    if(!!this.user) {
      this.email = this.user.email;
      this.name = this.user.name;
    }
  }

  private createNewUser(): Observable<AppUser> {
    this.error = '';

    return this.addUser()
      .pipe(
        filter(uid => !!uid),
        tap(() => this.afAuth.sendPasswordResetEmail(this.email)),
        switchMap(uid => this.userService.createNewAssessor(uid, this.name, this.email)));
  }

  private updateUser(): Observable<AppUser> {
    this.user.email = this.email;
    this.user.name = this.name;

    return this.callUpdateUser()
      .pipe(switchMap(() => this.userService.update(this.user)));
  }

  private addUser(): Observable<string> {
    const callable = this.angularFireFunctions.httpsCallable('addUser');
    return callable({ email: this.email, name: this.name } ).pipe(map(data => data.uid));
  }

  private callUpdateUser(): Observable<any> {
    const callable = this.angularFireFunctions.httpsCallable('updateUser');

    return callable({ email: this.email, name: this.name, uid: this.user.uid } );
  }
}
