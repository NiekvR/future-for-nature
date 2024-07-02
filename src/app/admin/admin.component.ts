import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppUser } from '@app/models/app-user';
import { Router } from '@angular/router';
import { NgxPopperjsTriggers } from 'ngx-popperjs';

@Component({
  selector: 'ffn-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public HOVER = NgxPopperjsTriggers.hover;
  public users!: AppUser[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  public open(link: string) {
    this.router.navigate(['/admin/' + link]);
  }
}
