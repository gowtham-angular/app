import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-submitted-cards',
  templateUrl: './submitted-cards.component.html',
  styleUrl: './submitted-cards.component.scss'
})
export class SubmittedCardsComponent {
  @Input() user: any;
  @Input() submittedData: any;
  totalInvestedData: any;
  constructor(private fireStore: AngularFirestore, private dataStorageService: DataStorageService) {
    this.getAccountBalance();
  }
  getAccountBalance() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if (data) {
        this.totalInvestedData = data;
      }
    })
  }

}


