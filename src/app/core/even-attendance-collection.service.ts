import { inject, Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { EventAttendance } from '@app/models/event-attendance.model';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventAttendanceCollectionService extends CollectionService<EventAttendance> {
  private firestore: Firestore = inject(Firestore);

  constructor() {
    super();
    this.setCollection(collection(this.firestore, 'event-attendance') as CollectionReference<EventAttendance, DocumentData>);
  }
}
