import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { from, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UserService } from '@app/core/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '@app/models/role.enum';
import firebase from 'firebase/compat';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private afAuth: AngularFireAuth) { }

  canActivate(): Observable<boolean> {
    return this.hasUser().pipe(
      tap(user => !user ? this.router.navigate(['/login']) : user),
      switchMap(user => this.isAdmin(user!)),
      tap(isAdmin => isAdmin ? this.router.navigate(['/admin']) : !isAdmin),
      map(isAdmin => !isAdmin));
  }

  private hasUser(): Observable<User | null> {
    return this.afAuth.user
      .pipe(take(1));
  }

  private isAdmin(user: User): Observable<boolean> {
    console.log(user);
    return !user ? of(false) : this.userService.get(user!.uid)
      .pipe(map(appUser => appUser.role === Role.admin));
  }

}
