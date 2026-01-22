import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ffn-dropout',
  standalone: true,
  imports: [],
  templateUrl: './dropout.component.html',
  styleUrl: './dropout.component.scss'
})
export class DropoutComponent {
  @Input() title: string = '';
  @HostBinding('class.closed') closed: boolean = true;

}
