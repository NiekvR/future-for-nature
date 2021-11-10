import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Application } from '@app/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCollectionService extends FirebaseCollectionService<Application> {

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Application>('application'));
  }

}
