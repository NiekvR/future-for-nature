import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Score } from '@app/models/score.model';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class ScoreCollectionService extends FirebaseCollectionService<Score> {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    super();
    this.setCollection(db.collection<Score>('score'));
  }

  public getScoresForApplication(applicationId: string): Observable<Score> {
    let userId!: string;
    return this.afAuth.user.pipe(
      take(1),
      tap(user => userId = user!.uid),
      switchMap(user => this.db.collection<Score>('score', ref => ref
        .where('applicationId', '==', applicationId)
        .where('userId', '==', user!.uid).limit(1))
        .snapshotChanges()),
      switchMap(list => list.length > 0 ?
        of(list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))[ 0 ]) :
        this.createNewScore(applicationId, userId)));
  }

  public getAllScoresForUser(uid: string): Observable<Score[]> {
    return this.db.collection<Score>('score', ref => ref
        .where('userId', '==', uid))
        .snapshotChanges().pipe(
      map(list => list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))));
  }

  public getAllScoresForApplicant(uid: string): Observable<Score[]> {
    return this.db.collection<Score>('score', ref => ref
        .where('applicationId', '==', uid))
        .snapshotChanges().pipe(
      map(list => list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))));
  }

  public getAllScoresForCurrentUser(): Observable<Score[]> {
    return this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.getAllScoresForUser(user!.uid)));
  }

  private createNewScore(applicationId: string, userId: string): Observable<Score> {
    const newScore: Score = {
      userId,
      applicationId,
      total: '0',
      subScores: {
        1.1: {
          id: '1.1',
        },
        1.2: {
          id: '1.2',
        },
        1.3: {
          id: '1.3',
        },
        2.1: {
          id: '2.1',
        },
        2.2: {
          id: '2.2',
        },
        3.1: {
          id: '3.1',
        },
        3.2: {
          id: '3.2',
        }
      },
      submitted: false,
      skipped: false
    }

    return this.add(newScore);
  }

  private docSnapshotToItem(queryDocumentSnapshot: QueryDocumentSnapshot<Score>): Score {
    let item = queryDocumentSnapshot.data() as Score;
    (item as any).id = queryDocumentSnapshot.id;
    item = this.convertItem(item);
    return item;
  }
}
