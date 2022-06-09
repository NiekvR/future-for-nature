import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScoreCategory } from '@app/models/score-category.model';
import { Score } from '@app/models/score.model';

@Component({
  selector: 'ffn-score-category',
  templateUrl: './score-category.component.html',
  styleUrls: ['./score-category.component.scss']
})
export class ScoreCategoryComponent implements OnInit, OnChanges {

  @Input() category!: ScoreCategory;
  @Input() score!: Score;
  @Input() canEdit!: boolean;
  @Output() categoryChanged = new EventEmitter<Score>();
  public subTotal = '0';

  constructor() { }

  ngOnInit(): void {
    this.calculateSubTotal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['score']?.currentValue) {
      this.calculateSubTotal();
    }
  }

  public updateSubTotal() {
    this.calculateSubTotal();
    this.categoryChanged.emit(this.score);
  }

  private calculateSubTotal() {
    const subScoresIds = Object.keys(this.score.subScores).filter(subScore => subScore.charAt(0) === this.category.id);
    this.subTotal = (subScoresIds.map(id => this.score.subScores[ id ].score!)
        .reduce((previousValue, currentValue) => (previousValue || 0) + (currentValue || 0)) /
      this.category.subs!.length)
      .toFixed(2);
  }

}
