import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EventAttendance } from '@app/models/event-attendance.model';

@Injectable({
  providedIn: 'root'
})
export class EventAttendanceCollectionService extends FirebaseCollectionService<EventAttendance> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<EventAttendance>('event-attendance'));
  }
}
