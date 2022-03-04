import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScoreCategory } from '@app/models/score-category.model';
import { SubScore } from '@app/models/score.model';

@Component({
  selector: 'ffn-score-input',
  templateUrl: './score-input.component.html',
  styleUrls: ['./score-input.component.scss']
})
export class ScoreInputComponent implements OnChanges {

  @Input() scoreCategory!: ScoreCategory;
  @Input() subScore!: SubScore;
  @Input() canScore = true;
  @Input() applicantId!: string;
  public error = false;
  @Output() scoreChanged = new EventEmitter<SubScore>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if(!!changes['applicantId']?.currentValue) {
      this.validateScore();
    }
  }

  public onBlur() {
    this.validateScore();
    this.scoreChanged.emit(this.subScore);
  }

  private validateScore() {
    if (this.subScore.score! < 0 || this.subScore.score! > 5) {
      this.error = true;
      this.subScore.score = null;
    } else {
      this.error = false;
    }
  }
}
