import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ffn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  public input!: string;
  @Output() searchTerm = new EventEmitter<string>();

  constructor() { }

  public emitSearchChange() {
    this.searchTerm.emit(this.input);
  }

}
