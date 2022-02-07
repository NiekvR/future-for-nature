import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { UserService } from '@app/core/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '@app/models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private afAuth: AngularFireAuth) { }

  canActivate(): Observable<boolean> {
    return this.isAdmin().pipe(
      tap(isAdmin => !isAdmin ? this.router.navigate(['/admin']) : isAdmin));
  }

  private isAdmin() {
    return this.afAuth.user
      .pipe(
        take(1),
        switchMap(user => this.userService.get(user!.uid)),
        map(appUser => appUser.role === Role.admin));
  }

}
