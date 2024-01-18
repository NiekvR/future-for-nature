import { inject, Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Event } from '@app/models/event.model';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventCollectionService extends CollectionService<Event> {
  private firestore: Firestore = inject(Firestore);

  constructor() {
    super();
    this.setCollection(collection(this.firestore, 'event') as CollectionReference<Event, DocumentData>);
  }
}
