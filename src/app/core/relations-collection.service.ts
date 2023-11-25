import { Injectable } from '@angular/core';
import { FirebaseCollectionService } from '@ternwebdesign/firebase-store';
import { Relation } from '@app/models/relation.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelationsCollectionService extends FirebaseCollectionService<Relation> {

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Relation>('relations'));
  }
}
