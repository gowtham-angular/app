import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-price-card',
  templateUrl: './price-card.component.html',
  styleUrl: './price-card.component.scss'
})
export class PriceCardComponent {
  @Input() user!: any;
  count!: any;
  totalInvested!: any;
  profit!: any;
  constructor(private router: Router, private dataStorageService: DataStorageService) {
    this.getAccountBalance();
    this.getProfit();
   
  }

  getAccountBalance() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if (data) {
        this.totalInvested = data;
      }
    })
  }

  getProfit() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getProfit(user?.id).subscribe((data) => {
      if (data) {
        this.profit = data;
      }
    })
  }

  withdraw() {
    this.router.navigate(['/withdrawAmount'])
  }

  
}
