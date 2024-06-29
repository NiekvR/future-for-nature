import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { filter, from, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { NgxModalService } from 'ngx-modalview';
import { ForgotPasswordComponent } from '@app/authentication/forgot-password/forgot-password.component';

@Component({
  selector: 'ffn-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = {
    name: '',
    password: ''
  };

  public error!: string | null;

  constructor(private afAuth: AngularFireAuth, private router: Router, private modalService: NgxModalService) { }

  ngOnInit(): void {
  }

  public login() {
    this.error = null;
    from(this.afAuth.signInWithEmailAndPassword(this.credentials.name, this.credentials.password))
      .subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: () => {
          this.error = 'Username or password unknown.'
        }
      });
  }

  public openPasswordModal() {
    this.modalService.addModal(ForgotPasswordComponent,{}).subscribe();
  }

}
