import { inject, Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Registration } from '@app/models/event-registration.model';
import { collection, query, where, getDocs } from "firebase/firestore";
import { from, map, Observable } from 'rxjs';
import { CollectionService } from '@app/core/collection.service';
import { CollectionReference, Firestore, limit } from '@angular/fire/firestore';
import { Relation } from '@app/models/relation.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationCollectionService extends CollectionService<Registration> {
  private firestore: Firestore = inject(Firestore);

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(collection(this.firestore, 'registration') as CollectionReference<Registration, DocumentData>);
  }

  public getAllFromEvent(eventId: string): Observable<Registration[]> {
    const q = query(collection(this.firestore, 'registration'), where("event", '==', eventId));

    return this.queryCollection(q)
  }

  public getLimitNumberOfItems(max: number): Observable<Registration[]> {
    const q = query(collection(this.firestore, 'registration'), limit(max));

    return this.queryCollection(q)
  }
}
