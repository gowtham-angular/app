import { Component } from '@angular/core';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss'
})
export class MissionCardComponent {
  user!: any;
  missionData: any;
  quantity: any;
  totalInvested!:any;

  constructor(private dataStorageService: DataStorageService) {
    this.user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.getTaskCount();
    this.getAccountBalance();
    this.getMissionData();
  }

  getTaskCount() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if(data) {
        this.quantity = data;
      }
    })
  }

  getAccountBalance() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if(data) {
        this.totalInvested = data;
      }
    })
  }

  getMissionData() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getMissionFlag(user?.id).subscribe((data: any) => {
      if(data) {
        this.missionData = data;
      }
    })
  }
}
