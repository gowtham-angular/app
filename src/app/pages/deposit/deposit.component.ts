import { Component } from '@angular/core';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.scss'
})
export class DepositComponent {
  openWhatsApp(): void {
    window.open('https://wa.me/9840213601', '_self');
  }
}
