import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScoreCategory } from '@app/models/score-category.model';
import { SubScore } from '@app/models/score.model';

@Component({
  selector: 'ffn-score-input',
  templateUrl: './score-input.component.html',
  styleUrls: ['./score-input.component.scss']
})
export class ScoreInputComponent implements OnInit {

  @Input() scoreCategory!: ScoreCategory;
  @Input() subScore!: SubScore;
  @Input() canScore = true;
  public error = false;
  @Output() scoreChanged = new EventEmitter<SubScore>();

  constructor() { }

  ngOnInit(): void {
  }

  public onBlur() {
    if (this.subScore.score! < 1 || this.subScore.score! > 5) {
      this.error = true;
      this.subScore.score = 1;
    } else {
      this.error = false;
      this.scoreChanged.emit(this.subScore);
    }
  }

}
