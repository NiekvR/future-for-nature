import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Event } from '@app/models/event.model';
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class EventCollectionService extends CollectionService<Event> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Event>('event'));
  }
}
