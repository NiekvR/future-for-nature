import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  private deleteAllDocsFromCollection(applications: Application[]): Observable<boolean> {
    return combineLatest(applications.map(application => this.deleteDoc(application)))
      .pipe(switchMap(results => results.filter(res => !res).length > 0 ?
        throwError(() => new Error('Not all docs deleted')) :
        of(true)));
  }

  private deleteDoc(application: Application): Observable<boolean> {
    return this.delete(application).pipe(map(() => true), catchError(map(() => false)));
  }

}
