import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vip-three',
  templateUrl: './vip-three.component.html',
  styleUrl: './vip-three.component.scss'
})
export class VipThreeComponent {
  @Input() vipThree: any;
}
