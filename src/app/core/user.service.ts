import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppUser } from '@app/models/app-user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, map, Observable, combineLatest, switchMap, forkJoin, take, filter } from 'rxjs';
import { Role } from '@app/models/role.enum';
import firebase from 'firebase/compat';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CollectionService<AppUser>  {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
    this.setCollection(db.collection<AppUser>('user'));
  }

  public getMySelf(): Observable<AppUser> {
    return this.afAuth.user
      .pipe(
        filter(user => !!user),
        switchMap(user => this.get(user!.uid)));
  }

  public getAllAssessors(): Observable<AppUser[]> {
    return this.db.collection('user', ref => ref.where('role', '==', Role.assessor)).snapshotChanges()
      .pipe(map(list => list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))));
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
      .pipe(() => this.get(uid));
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

  private docSnapshotToItem(queryDocumentSnapshot: QueryDocumentSnapshot<any>): AppUser {
    let item = queryDocumentSnapshot.data() as AppUser;
    (item as any).id = queryDocumentSnapshot.id;
    item = this.convertItem(item);
    return item;
  }
}
