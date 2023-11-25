import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from '@app/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventCollectionService extends FirebaseCollectionService<Event> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Event>('event'));
  }
}
