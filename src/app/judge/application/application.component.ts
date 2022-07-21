import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { SelectedText } from '@app/models/text-select.model';
import { SelectionRectangle, TextSelectEvent } from '@app/shared/pipes/highlight-text.pipe';
import { HighlightService } from '@app/core/highlight.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ApplicationService } from '@app/core/application.service';

@Component({
  selector: 'ffn-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {

  @Input() application!: Application;
  public age!: number;
  public highlights!: { [id: string]: SelectedText };
  public hostRectangle: SelectionRectangle | undefined;
  public isHighlighted = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private highlightService: HighlightService, private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.dateOfBirthToAge();
    this.getHighlights();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public showSelectedText() {
    this.highlightService.showSelectedText(this.application.id!);
    this.hostRectangle = undefined;
  }

  public removeSelection() {
    this.highlightService.removeSelection(this.application.id!);
    this.hostRectangle = undefined;
  }

  public openPopup(event: TextSelectEvent) {
    if (event.viewportRectangle) {
      this.isHighlighted = this.highlightService.isSelectionHighlighted(this.application.id!, event.id);
      this.hostRectangle = event.viewportRectangle;
    } else {
      this.hostRectangle = undefined;
    }
  }

  private dateOfBirthToAge() {
    this.age = this.applicationService.getAge(this.application.dateOfBirth);
  }

  private getHighlights() {
    this.highlightService.getHighlights(this.application.id!)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(highlights => this.highlights = highlights);
  }
}
