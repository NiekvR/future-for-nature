import { Injectable } from '@angular/core';
import { Relation } from '@app/models/relation.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CollectionService } from '@app/core/collection.service';

@Injectable({
  providedIn: 'root'
})
export class RelationsCollectionService extends CollectionService<Relation> {

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(db.collection<Relation>('relations'));
  }
}
