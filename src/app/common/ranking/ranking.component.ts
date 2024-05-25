import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { FirestoreService } from '../../service/firestore.service';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerDialogContentComponent } from '../spinner-dialog-content/spinner-dialog-content.component';
import { take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { DataStorageService } from '../../data-storage.service';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  @Input() randomData: any;
  @Input() originalData: any;
  @Input() isVipTwoEnabled!: boolean;
  user: any;
  totalAmount!: number;
  isMissionComplete!: boolean;
  countData: any;
  totalInvested: any;
  constructor(
    private utilService: UtilsService,
    private firestoreService: FirestoreService,
    private router: Router,
    private dialog: MatDialog,
    private dataStorageService: DataStorageService
  ) {

    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.utilService.isMissionComplete.subscribe((flag: boolean) => {
      this.isMissionComplete = flag;
    });

    this.utilService.isVipTwoEnabled.subscribe((flag: any) => {
      this.isVipTwoEnabled = flag;
    })
    this.getTaskCount();
    this.getAccountBalance();

  }

  getTaskCount() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.countData = data;
      }
    })
  }

  getAccountBalance() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if (data) {
        this.totalInvested = data;
      }
    })
  }

  submitVip() {

    if (this.randomData && this.randomData.missionAmount > 0) {
      this.utilService.openDialog('Task Confirmation','Please Contact Customer Support for Task completion');
      this.isMissionComplete = false;
      return;
    }
    this.isMissionComplete = true;
    let docData = { ...this.randomData, isSubmitted: true, time: Timestamp.fromDate(new Date()) }
    let dataArray = [];
    dataArray.push(docData);

    const dialogRef = this.dialog.open(SpinnerDialogContentComponent, {
      disableClose: true // Prevent closing by clicking outside or pressing Escape
    });

    setTimeout(() => {
      dialogRef.close({ manuallyClosed: false }); // Pass output indicating it was automatically closed
      if (!this.isVipTwoEnabled) {
        this.firestoreService.updateSubmittedData('vip_one_submitted', this.user.id, dataArray);
        this.firestoreService.removeData('vip_one', this.user.id, this.randomData);
        this.utilService.isVipOneEnabled.next(false);

      } else {
        this.firestoreService.updateSubmittedData('vip_two_submitted', this.user.id, dataArray);
        this.firestoreService.removeData('vip_two', this.user.id, this.randomData);
        this.utilService.isVipTwoEnabled.next(false);
      }

      this.router.navigate(['/play']);
    }, 2000);

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}

