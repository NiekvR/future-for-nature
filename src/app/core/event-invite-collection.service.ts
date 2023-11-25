import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EventInvite } from '@app/models/event-invite.model';

@Injectable({
  providedIn: 'root'
})
export class EventInviteCollectionService extends FirebaseCollectionService<EventInvite> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<EventInvite>('event-invite'));
  }
}
