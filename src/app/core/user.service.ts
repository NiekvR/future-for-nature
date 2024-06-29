import { inject, Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { AppUser } from '@app/models/app-user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, switchMap, forkJoin, take, filter, tap } from 'rxjs';
import { Role } from '@app/models/role.enum';
import firebase from 'firebase/compat';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';
import { query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CollectionService<AppUser>  {
  private firestore: Firestore = inject(Firestore);

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
    this.setCollection(collection(this.firestore, 'user') as CollectionReference<AppUser, DocumentData>);
  }

  public getMySelf(): Observable<AppUser> {
    return this.afAuth.user
      .pipe(
        filter(user => !!user),
        switchMap(user => this.get(user!.uid)));
  }

  public getAllAssessors(): Observable<AppUser[]> {
    const q = query(collection(this.firestore, 'user'), where('role', '==', Role.assessor));

    return this.queryCollection(q)
  }

  public createNewAssessor(uid: string, name: string, email: string): Observable<AppUser> {
    let user: AppUser = {
      uid,
      name,
      email,
      admin: false,
      role: Role.assessor,
      submitted: false
    }

    return from(this.db.collection('user').doc(user.uid).set(Object.assign({}, user)))
      .pipe(switchMap(() => this.get(uid)));
  }

  public resetSubmitted(): Observable<AppUser[]> {
    return this.getAllAssessors()
      .pipe(
        take(1),
        switchMap(users => this.resetSubmittedForAssessors(users)))
  }

  private resetSubmittedForAssessors(users: AppUser[]): Observable<AppUser[]> {
    users.forEach(user => user.submitted = false);
    return forkJoin(users.map(user => this.update(user).pipe(take(1))));
  }
}
