import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EventInvite } from '@app/models/event-invite.model';
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class EventInviteCollectionService extends CollectionService<EventInvite> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<EventInvite>('event-invite'));
  }
}
