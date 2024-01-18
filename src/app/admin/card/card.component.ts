import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ffn-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() icon!: string;
  @Input() label!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
