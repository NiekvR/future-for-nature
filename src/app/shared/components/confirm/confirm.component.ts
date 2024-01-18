import { Component } from '@angular/core';
import { NgxModalComponent } from 'ngx-modalview';
export interface ConfirmModel {
  title:string;
  message?:string;
}

@Component({
  selector: 'ffn-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent extends NgxModalComponent<ConfirmModel, boolean> implements ConfirmModel {
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
