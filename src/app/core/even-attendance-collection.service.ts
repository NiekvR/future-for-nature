import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EventAttendance } from '@app/models/event-attendance.model';
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class EventAttendanceCollectionService extends CollectionService<EventAttendance> {

  constructor(db: AngularFirestore) {
    super();
    this.setCollection(db.collection<EventAttendance>('event-attendance'));
  }
}
