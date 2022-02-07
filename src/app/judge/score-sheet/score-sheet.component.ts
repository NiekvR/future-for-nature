import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Application } from '@app/models/application.model';
import { ScoreCategory } from '@app/models/score-category.model';
import { Score } from '@app/models/score.model';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { SCORE_CATEGORIES } from '@app/judge/score-categories';

@Component({
  selector: 'ffn-score-sheet',
  templateUrl: './score-sheet.component.html',
  styleUrls: ['./score-sheet.component.scss']
})
export class ScoreSheetComponent implements OnChanges, OnDestroy {

  @Input() application!: Application;

  public total = '0'

  public categories: ScoreCategory[] = SCORE_CATEGORIES;
  public score!: Score;
  public canSubmit = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private scoreCollectionService: ScoreCollectionService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['application'].currentValue) {
      this.getScores();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public calculateTotal() {
    let totalScore = 0;
    let totalCategories = 0;
    Object.values(this.score.subScores).forEach(subScores => {
      totalScore += ( subScores.score! || 1);
      totalCategories++;
    });
    this.score.total = (totalScore / totalCategories).toFixed(2);
    this.everythingScored();
    this.updateScores().subscribe();
  }

  public submitScores() {
    this.score.submitted = true;
    this.scoreCollectionService.update(this.score).subscribe();
  }

  private everythingScored() {
    this.canSubmit = !Object.values(this.score.subScores).find(subScore => !subScore.score);
  }

  private getScores() {
    this.scoreCollectionService.getScoresForApplication(this.application.id!)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(score => {
        this.score = score;
        this.everythingScored();
      });
  }

  private updateScores(): Observable<Score> {
    return this.scoreCollectionService.update(this.score);
  }
}
