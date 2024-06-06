import { Component, Input } from '@angular/core';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrl: './balance-card.component.scss'
})
export class BalanceCardComponent {

  totalInvested: any;
  profit: any;
  count: any;
  constructor(
    private dataStorageService: DataStorageService
  ) {
    this.getAccountBalance();
    this.getProfit();
    this.getTaskCount();
  }

  getAccountBalance() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if(data) {
        this.totalInvested = data;
      }
    })
  }

  getProfit() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getProfit(user?.id).subscribe((data) => {
      if(data) {
        this.profit = data;
      }
    })
  }

  getTaskCount() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if(data) {
        this.count = data;
      }
    })
  }
}
