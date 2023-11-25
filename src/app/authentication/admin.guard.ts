import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UserService } from '@app/core/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '@app/models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private userService: UserService, private router: Router, private afAuth: AngularFireAuth) { }

  canActivate(): Observable<boolean> {
    return this.isAdmin().pipe(
      tap(isAdmin => !isAdmin ? this.router.navigate(['/login']) : isAdmin));
  }

  private isAdmin() {
    return this.afAuth.user
      .pipe(
        take(1),
        switchMap(user => !!user ? this.userService.get(user!.uid) : of(null)),
        map(appUser => !!appUser && appUser.role === Role.admin));
  }

}
