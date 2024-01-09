import { inject, Injectable } from '@angular/core';
import { Relation } from '@app/models/relation.model';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { CollectionService } from '@app/core/collection.service';
import { CollectionReference, Firestore, limit } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Event } from '@app/models/event.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelationsCollectionService extends CollectionService<Relation> {
  private firestore: Firestore = inject(Firestore);

  constructor(private db: AngularFirestore) {
    super();
    this.setCollection(collection(this.firestore, 'relations') as CollectionReference<Relation, DocumentData>);
  }

  public getLimitNumberOfItems(max: number): Observable<Relation[]> {
    const q = query(collection(this.firestore, 'relations'), limit(max));

    return this.queryCollection(q);
  }

  protected override convertItem(item: any): Relation {
    if(!!item.dayOfBirth) {
      item.dayOfBirth = item.dayOfBirth.toDate();
    }

    if(!!item.ffnFriendCancelDate) {
      item.ffnFriendCancelDate = item.ffnFriendCancelDate.toDate();
    }
    return super.convertItem(item);
  }
}
