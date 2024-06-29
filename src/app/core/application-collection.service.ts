import { inject, Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Application } from '@app/models/application.model';
import { map, Observable, switchMap, combineLatest, catchError, throwError, of, tap, take } from 'rxjs';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCollectionService extends CollectionService<Application> {
  private firestore: Firestore = inject(Firestore);

  constructor(private afs: AngularFirestore) {
    super();
    this.afs.collection('application').snapshotChanges()
    this.setCollection(collection(this.firestore, 'application') as CollectionReference<Application, DocumentData>);
  }

  public clearCollection(): Observable<boolean> {
    return this.getAll()
      .pipe(take(1),switchMap(applications => applications.length > 0 ?
      this.deleteAllDocsFromCollection(applications) :
      of(true)))
  }

  public getAllSelectedApplications(): Observable<Application[]> {
    return this.getAll()
      .pipe(map(applications => applications.filter(application => application.checked === 'yes')));
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
