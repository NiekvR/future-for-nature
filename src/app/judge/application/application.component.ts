import { Component, Input, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';

@Component({
  selector: 'ffn-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  @Input() application!: Application;

  constructor() { }

  ngOnInit(): void {
  }
}
