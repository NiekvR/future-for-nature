import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ffn-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
  }



  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

}
