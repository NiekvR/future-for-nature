import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'ffn-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends SimpleModalComponent<{}, boolean> {

  public email!: string;

  public error!: string | null;

  constructor(private afAuth: AngularFireAuth) {
    super();
  }

  public send() {
    if (!!this.email) {
      from(this.afAuth.sendPasswordResetEmail(this.email))
        .subscribe(
          () => this.confirm(),
          error => this.setErrorMessage(error))
    }
  }

  private confirm() {
    this.result = true;
    this.close();
  }

  private setErrorMessage(error: FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email': this.error = 'The email address is badly formatted.'; break;
      case 'auth/user-not-found': this.error = 'There is no user record corresponding to this identifier.'; break;
      default: this.error = 'An unknown error occurred'
    }
  }

}
