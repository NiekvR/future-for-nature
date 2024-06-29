import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ffn-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() options!: string[];
  @Input() option!: string;
  @Output() optionChange = new EventEmitter<string>();

  constructor() { }

  public onSelect(option: string) {
    this.option = option;
    this.optionChange.emit(option);
  }

}
