import { inject, Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Highlights } from '@app/models/highlights.model';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { SelectedText } from '@app/models/text-select.model';
import { DivSelection } from '@app/models/div-selection.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { Application } from '@app/models/application.model';
import { ApplicationService } from '@app/core/application.service';
import { CollectionService } from '@app/core/collection.service';
import { collection, CollectionReference, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HighlightService extends CollectionService<Highlights> {
  private firestore: Firestore = inject(Firestore);

  private highlights: { [ applicationId: string ]: BehaviorSubject<Highlights | null> } = {};

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private applicationService: ApplicationService,
              private applicationCollectionService: ApplicationCollectionService) {
    super();
    this.setCollection(collection(this.firestore, 'highlights') as CollectionReference<Highlights, DocumentData>);
  }

  public getHighlights(applicationId: string): Observable<{ [ id: string ]: SelectedText }> {
    if (!this.exists(applicationId)) {
      this.highlights[ applicationId ] = new BehaviorSubject<Highlights | null>(null);
      this.getHighlightsForApplicationFromBE(applicationId);
    }

    return this.highlights[ applicationId ].asObservable()
      .pipe(
        filter(highlights => !!highlights),
        map(highlights => highlights!.highlights));
  }

  public isSelectionHighlighted(applicationId: string, fieldId: string): boolean {
    return this.highlights[ applicationId ].getValue()!.highlights[ fieldId ].selected
      .filter(selection =>
        this.isOverlapping(selection, this.getSelection(applicationId, fieldId, window.getSelection() as Selection))).length > 0;
  }

  public showSelectedText(applicationId: string) {
    if (window.getSelection) {
      const selection = window.getSelection();
      const divId = selection!.focusNode!.parentElement!.id;
      const divSelection = this.getSelection(applicationId, divId, selection!);
      this.addNewSelection(applicationId, divId, divSelection);
    }
    this.saveHighlights(applicationId);
  }

  public removeSelection(applicationId: string) {
    if (window.getSelection) {
      const selection = window.getSelection();
      const divId = selection!.focusNode!.parentElement!.id;
      const divSelection = this.getSelection(applicationId, divId, selection!);
      this.removeNewSelection(applicationId, divId, divSelection);
    }
    this.saveHighlights(applicationId);
  }

  private getHighlightsForApplicationFromBE(applicationId: string) {
    let userId!: string;
    return this.afAuth.user.pipe(
      take(1),
      tap(user => userId = user!.uid),
      switchMap(user => this.db.collection<Highlights>('highlights', ref => ref
        .where('applicationId', '==', applicationId)
        .where('userId', '==', user!.uid).limit(1))
        .snapshotChanges()),
      switchMap(list => {
        return list.length > 0 ?
          of(list.map(docChangeAction => this.docSnapshotToItem(docChangeAction.payload.doc))[ 0 ]) :
          this.createHighlights(applicationId);
      }))
      .subscribe(highlights => this.highlights[ applicationId ].next(highlights));
  }

  private addNewSelection(applicationId: string, divId: string, selection: DivSelection) {
    let selections = this.highlights[ applicationId ].getValue()?.highlights[ divId ].selected!;
    let overlappingSelections = this.overlappingSelections(selections, selection);
    if(overlappingSelections.length > 0) {

      while (overlappingSelections.length > 0) {
        const overlap = overlappingSelections[ 0 ]
        selections = this.removeOverlapFromSelected(overlap, selections);
        const newSelection = this.getNewSelection(overlap, selection);
        selections.push(newSelection);
        overlappingSelections.shift();
      }
    } else {
      selections.push(selection);
    }
    this.createNewTextFromSelections(applicationId, divId, selections);
  }

  private removeNewSelection(applicationId: string, divId: string, selection: DivSelection) {
    let selections = this.highlights[ applicationId ].getValue()!.highlights[ divId ].selected;
    let overlappingSelections = this.overlappingSelections(selections, selection);

    while (overlappingSelections.length > 0) {
      const overlap = overlappingSelections[ 0 ]
      selections = this.removeOverlapFromSelected(overlap, selections);
      overlappingSelections = this.overlappingSelections(selections, selection);
    }
    this.createNewTextFromSelections(applicationId, divId, selections);
  }

  private overlappingSelections(selections: DivSelection[], selection: DivSelection) {
    return selections.filter(sel => this.isOverlapping(sel, selection))
  }

  private isOverlapping(a: DivSelection, b: DivSelection): boolean {
    return (b.end > a.start && b.end < a.end) ||
      (b.start > a.start && b.start < a.end) ||
      (b.start <= a.start && b.end >= a.end);
  }

  private removeOverlapFromSelected(overlap: DivSelection, selected: DivSelection[]): DivSelection[] {
    const index = selected.indexOf(overlap);
    if (index > -1) {
      selected.splice(index, 1);
    }
    return selected;
  }

  private getNewSelection(overlap: DivSelection, selection: DivSelection): DivSelection {
    return this.mergeOverlaps(overlap, selection);
  }

  private mergeOverlaps(overlap: DivSelection, selection: DivSelection): DivSelection {
    return { start: this.getNewStart(overlap.start, selection.start), end: this.getNewEnd(overlap.end, selection.end) };
  }

  private getNewStart(a: number, b: number) {
    return a < b ? a : b;
  }

  private getNewEnd(a: number, b: number) {
    return a > b ? a : b;
  }

  private createNewTextFromSelections(applicationId: string, divId: string, selected: DivSelection[]) {
    const highlights = this.highlights[ applicationId ].getValue()!;
    const selectedText = highlights?.highlights[ divId ]!;
    selectedText.selected = selected;
    let newText = selectedText.originalText;
    selected.sort((a, b) => b.start - a.start);
    selected.forEach(selection => {
      newText = newText.substring(0, selection.start) +
        '<mark>' + newText.substring(selection.start, selection.end) +
        '</mark>' + newText.substring(selection.end);
    });
    selectedText.text = newText;
    highlights.highlights[ divId ] = selectedText;
    this.highlights[ applicationId ].next(highlights);
  }

  private getSelection(applicationId: string, divId: string, selection: Selection): DivSelection {
    // @ts-ignore
    const divText: string = this.highlights[ applicationId ].getValue()?.highlights[ divId ].originalText;
    // @ts-ignore
    const startIndex = divText.indexOf(selection.anchorNode.data);
    const start = selection!.anchorOffset > selection!.focusOffset ? selection!.focusOffset : selection!.anchorOffset;
    const end = selection!.anchorOffset > selection!.focusOffset ? selection!.anchorOffset : selection!.focusOffset;

    return { start: startIndex + start, end: startIndex + end };
  }

  private addNewHighlights(applicationId: string, highlights: { [ id: string]: SelectedText }): Observable<Highlights> {
    return this.afAuth.user.pipe(
      take(1),
      map(user => {
        return { userId: user!.uid, applicationId: applicationId, highlights: highlights}
      }),
      switchMap(highlights => this.add(highlights)));
  }

  private saveHighlights(applicationId: string) {
    this.update(this.highlights[ applicationId ].getValue()!).subscribe();
  }

  private createHighlights(applicationId: string): Observable<Highlights> {
    return this.applicationCollectionService.get(applicationId)
      .pipe(
        map(application => this.setSelectedText(application)),
        switchMap(selectedText => this.addNewHighlights(applicationId, selectedText)));
  }

  private setSelectedText(application: Application): { [id: string]: SelectedText } {
    const highlights: { [id: string]: SelectedText } = {};
    Object.keys(application)
      .forEach(key => {
        // @ts-ignore
        highlights[ key ] = this.createNewSelectedText(application[ key ]);
      });
    highlights[ 'name' ] = this.createNewSelectedText(application.name.fullName);
    highlights[ 'age' ] = this.createNewSelectedText('' + this.applicationService.getAge(application.dateOfBirth));
    application.referee.forEach((referee, index) => {
      Object.keys(referee)
        .forEach(key => {
          // @ts-ignore
          highlights[ index + '-' + key ] = this.createNewSelectedText(referee[ key ]);
        });
      highlights[ index + '-name' ] = this.createNewSelectedText(referee.name.fullName);
    });
    return highlights
  }

  private createNewSelectedText(originalText: string): SelectedText {
    return { text: originalText, originalText: originalText, selected: [] };
  }

  private exists(applicationId: string): boolean {
    return !!this.highlights[ applicationId ];
  }
}
