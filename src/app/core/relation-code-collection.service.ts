import { inject, Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Event } from '@app/models/event.model';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';
import { RelationCode } from '@app/models/relation-code.model';
import { map, Observable, switchMap, take } from 'rxjs';
import { Relation } from '@app/models/relation.model';

@Injectable({
  providedIn: 'root'
})
export class RelationCodeCollectionService extends CollectionService<RelationCode> {
  private firestore: Firestore = inject(Firestore);

  constructor() {
    super();
    this.setCollection(collection(this.firestore, 'relation-code') as CollectionReference<RelationCode, DocumentData>);
  }

  public getLatestRelationCode(): Observable<number> {
    return this.get('P8Ac71OzlH8OB4u2QuEd').pipe(take(1), map(relationCode => relationCode.latest));
  }
  public updateRelationCode(relation: Relation): Observable<Relation> {
    return this.get('P8Ac71OzlH8OB4u2QuEd')
      .pipe(
        take(1),
        switchMap(relationCode => {
          relationCode.latest = relation.relationCode!;
          console.log(relationCode);
          return this.update(relationCode)
        }),
        map(() => relation));
  }
}
