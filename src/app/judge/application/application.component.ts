import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Application } from '@app/models/application.model';

@Component({
  selector: 'ffn-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnChanges {

  @Input() application!: Application;
  public age!: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dateOfBirthToAge()
  }

  private dateOfBirthToAge() {
    const dateOfBirth = new Date(this.application.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const month = today.getMonth() - dateOfBirth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    this.age = age;
  }
}
