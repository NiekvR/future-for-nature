import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
export interface ConfirmModel {
  title:string;
  message?:string;
}

@Component({
  selector: 'ffn-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent extends SimpleModalComponent<ConfirmModel, boolean> implements ConfirmModel {
  public title!: string;
  public message!: string;

  constructor() {
    super();
  }

  public confirm() {
    this.result = true;
    this.close();
  }
}
