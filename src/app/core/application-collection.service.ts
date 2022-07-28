import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Application } from '@app/models/application.model';
import { map, Observable, switchMap, combineLatest, catchError, throwError, of, tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCollectionService extends FirebaseCollectionService<Application> {

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Application>('application'));
  }

  public clearCollection(): Observable<boolean> {
    return this.getAll()
      .pipe(take(1),switchMap(applications => applications.length > 0 ?
      this.deleteAllDocsFromCollection(applications) :
      of(true)))
  }

  public getAllSelectedApplications(): Observable<Application[]> {
    return this.db.collection<Application>('application', ref => ref
      .where('checked', '==', true))
      .snapshotChanges().pipe(
      map(list => list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))));
  }

  private deleteAllDocsFromCollection(applications: Application[]): Observable<boolean> {
    return combineLatest(applications.map(application => this.deleteDoc(application)))
      .pipe(switchMap(results => results.filter(res => !res).length > 0 ?
        throwError(() => new Error('Not all docs deleted')) :
        of(true)));
  }

  private deleteDoc(application: Application): Observable<boolean> {
    return this.delete(application).pipe(map(() => true), catchError(map(() => false)));
  }

  private docSnapshotToItem(queryDocumentSnapshot: QueryDocumentSnapshot<Application>): Application {
    let item = queryDocumentSnapshot.data() as Application;
    (item as any).id = queryDocumentSnapshot.id;
    item = this.convertItem(item);
    return item;
  }
}
