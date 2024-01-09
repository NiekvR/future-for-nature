import { inject, Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { EventInvite } from '@app/models/event-invite.model';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventInviteCollectionService extends CollectionService<EventInvite> {
  private firestore: Firestore = inject(Firestore);

  constructor() {
    super();
    this.setCollection(collection(this.firestore, 'event-invite') as CollectionReference<EventInvite, DocumentData>);
  }
}
