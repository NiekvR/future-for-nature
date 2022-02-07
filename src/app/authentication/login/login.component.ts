import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';
import { Router } from '@angular/router';

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

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

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
          this.error = 'Uw gebruikersnaam of wachtwoord is bij ons niet bekend.'
        }
      });
  }

}
