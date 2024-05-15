import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss'
})
export class BalanceCardComponent {
@Input() user!: any;
@Input() count!: any;
@Input() totalAmount!: number;

}
