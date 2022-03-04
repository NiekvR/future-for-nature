import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Application } from '@app/models/application.model';
import { ScoreCategory } from '@app/models/score-category.model';
import { Score } from '@app/models/score.model';
import { ScoreCollectionService } from '@app/core/score-collection.service';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { SCORE_CATEGORIES } from '@app/judge/score-categories';
import { AppUser } from '@app/models/app-user';
import { UserService } from '@app/core/user.service';

@Component({
  selector: 'ffn-score-sheet',
  templateUrl: './score-sheet.component.html',
  styleUrls: ['./score-sheet.component.scss']
})
export class ScoreSheetComponent implements OnInit, OnChanges, OnDestroy {

  @Input() application!: Application;

  public total = '0'

  public categories: ScoreCategory[] = SCORE_CATEGORIES;
  public score!: Score;
  public canSubmit = false;
  public canEdit = true;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private scoreCollectionService: ScoreCollectionService, private userService: UserService) { }

  ngOnInit() {
    this.getCanEdit();
  }

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
    this.categories.forEach(category => {
      let totalCategoryScore = 0;
      let totalSubCategories = 0;
      category.subs!.forEach(subCategory => {
        totalCategoryScore += ( this.score.subScores[ subCategory.id ].score! || 0);
        totalSubCategories++;
      })

      totalScore += (totalCategoryScore / totalSubCategories) * category.relevance!
    });
    this.score.total = totalScore.toFixed(2);
    this.everythingScored();
    this.updateScores().subscribe();
  }

  public submitScores() {
    this.score.skipped = false;
    this.score.submitted = !this.score.submitted;
    this.scoreCollectionService.update(this.score).subscribe();
  }

  public skipScores() {
    this.score.skipped = true;
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
        console.log(score);
        this.everythingScored();
      });
  }

  private updateScores(): Observable<Score> {
    return this.scoreCollectionService.update(this.score);
  }

  private getCanEdit() {
    this.userService.getMySelf()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => this.canEdit = !user.submitted);
  }
}
