import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ScoreCategory } from '@app/models/score-category.model';
import { SubScore } from '@app/models/score.model';

@Component({
  selector: 'ffn-score-input',
  templateUrl: './score-input.component.html',
  styleUrls: ['./score-input.component.scss']
})
export class ScoreInputComponent implements OnChanges, OnInit {

  @Input() scoreCategory!: ScoreCategory;
  @Input() subScore!: SubScore;
  @Input() canScore = true;
  @Input() applicantId!: string;
  public error = false;
  @Output() scoreChanged = new EventEmitter<SubScore>();

  private inputEl!: HTMLElement;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.inputEl = this.el.nativeElement.querySelector('input');
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!!changes['applicantId']?.currentValue) {
      this.validateScore();
    }
    if(changes['subScore']?.currentValue !== changes['subScore']?.previousValue) {
      this.validateScore();
    }
  }

  public focus() {
    this.inputEl.focus();
  }

  public onBlur() {
    this.validateScore();
    this.scoreChanged.emit(this.subScore);
  }

  private validateScore() {
    if (this.subScore.score! < 1 || this.subScore.score! > 5) {
      this.error = true;
      this.subScore.score = null;
    } else {
      this.error = false;
    }
  }
}
