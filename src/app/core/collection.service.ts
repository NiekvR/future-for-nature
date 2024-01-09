import { Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  DocumentSnapshot,
  CollectionReference,
  doc,
  setDoc, getDoc, deleteDoc
} from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { Registration } from '@app/models/event-registration.model';
import { Query, getDocs } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class CollectionService<T> {
  private collection = new BehaviorSubject<CollectionReference<T> | null>(null);

  constructor() {
  }

  public get(id: string): Observable<T> {
    return this.getCurrentCollection()
      .pipe(
        map(col => doc(col, id)),
        switchMap(ref => getDoc(ref)),
        map(doc => this.convertDocToItem(doc as DocumentSnapshot<T>)));
  }

  public getAll(): Observable<T[]> {
    return this.getCollection$()
      .pipe(
        // @ts-ignore
        switchMap(col => !!col ? collectionData(col, { idField: 'id' }) as Observable<T[]> : of([])));
  }

  public queryCollection(query: Query): Observable<T[]> {
    return from(getDocs(query))
      .pipe(map(snapshot => {
        const documents: T[] = [];

        snapshot.forEach(doc => {
          const reg = this.convertItem(doc.data());
          (reg as any).id = doc.id;
          documents.push(reg);
        })

        return documents;
      }));
  }

  public add(item: T): Observable<T> {
    delete (item as any).id;
    return this.getCurrentCollection()
      .pipe(
        switchMap(col => addDoc(col, <T> item)),
        map(document => {
          (item as any).id = document.id;
          return item;
        }));
  }

  public update(item: T): Observable<T> {
    return this.getCurrentCollection()
      .pipe(
        map(col => doc(col, (item as any).id)),
        switchMap(ref => setDoc(ref, item)),
        map(document => item));
  }

  public delete(item: T): Observable<void> {
    return this.getCurrentCollection()
      .pipe(
        map(col => doc(col, (item as any).id)),
        switchMap(ref =>  deleteDoc(ref)));
  }

  protected convertItem(item: any): T {
    return item;
  }

  protected setCollection(collection: CollectionReference <T>| null): void {
    this.collection.next(collection);
  }

  private getCollection$(): Observable<CollectionReference<T> | null> {
    return this.collection.asObservable();
  }

  private getCurrentCollection(): Observable<CollectionReference<T>> {
    return this.getCollection$()
      .pipe(take(1), switchMap(col => !!col ? of(col) : throwError(new Error('Collection does not exist'))));
  }

  private convertDocToItem(doc: DocumentSnapshot<T>): T {
    let item = doc.data() as T;
    (item as any).id = doc.id;
    item = this.convertItem(item);
    return item;
  }

  public docSnapshotToItem(queryDocumentSnapshot: QueryDocumentSnapshot<T>): T {
    let item = queryDocumentSnapshot.data() as T;
    (item as any).id = queryDocumentSnapshot.id;
    item = this.convertItem(item);
    return item;
  }
}
