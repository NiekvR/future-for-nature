import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Registration } from '@app/models/event-registration.model';
import { collection, query, where, getDocs } from "firebase/firestore";
import { from, map, Observable } from 'rxjs';
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationCollectionService extends CollectionService<Registration> {

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Registration>('registration'));
  }

  public getAllFromEvent(eventId: string): Observable<Registration[]> {
    this.db.collection('registration')

    const q = query(collection(this.db.firestore, 'registration'), where("event", '==', eventId));

    return from(getDocs(q))
      .pipe(map(snapshot => {
        console.log(snapshot);
        const registrations: Registration[] = [];

        snapshot.forEach(doc => {
          const reg = doc.data() as Registration;
          reg.id = doc.id;
          registrations.push(reg);
        })

        return registrations;
      }));
  }
}
