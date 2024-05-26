import { Component, OnDestroy } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { DetailsDialogComponent } from '../../common/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { DataStorageService } from '../../data-storage.service';
import { ConfirmationBoxComponent } from '../../common/confirmation-box/confirmation-box.component';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent {

  products: any;
  user: any;
  submittedData: any;
  totalCount!: number;
  totalAmount!: number;
  totalCountFlag!: boolean;
  vipOneFlag!: boolean;
  vipTwoFlag!: boolean;
  vipThreeFlag!: boolean;
  isMissionComplete!: boolean;
  countData!: any;
  vipFlags!: any;
  vipThree: any;


  constructor(
    private fireStore: AngularFirestore,
    public dialog: MatDialog,
    private dataStorageService: DataStorageService,
    private utilService: UtilsService,
    private fireStoreService: FirestoreService,
    private productService: ProductsService,
  ) {
    this.getProducts();

    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getTotalInvested(this.user);
    this.getVipFlags(this.user);
    this.getTaskCount();
  }

  getTaskCount() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.countData = data;
      }
      this.getVipThree();
    })
  }
  getTotalInvested(user: any) {
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data: any) => {
      this.totalAmount = data?.totalInvested;
    })
  }

  getVipFlags(user: any) {
    this.dataStorageService.getVipFlags(user?.id).subscribe((items: any) => {
      this.vipFlags = items?.data;
      if (this.vipFlags && this.vipFlags.length > 0) {
        this.vipOneFlag = this.vipFlags[0].value;
        this.vipTwoFlag = this.vipFlags[1].value;
        this.vipThreeFlag = this.vipFlags[2].value;
      }
    })
  }
  getVipThree() {
    this.productService.getAllProducts().pipe(take(1)).subscribe((data: any) => {
      if (data) {
        this.vipThree = data.filter((item: any) => item.level === 'vip_3');
      }
    })
  }

  start() {
    if (this.vipOneFlag && this.countData?.taskCount < 20) {
      if (this.user) {
        if (this.totalAmount < 1) {
          this.utilService.openDialog('Tasks', 'Please Recharge before start the tasks.');
        } else {

          const dialogRef = this.dialog.open(DetailsDialogComponent);
          dialogRef.afterClosed().subscribe((result: any) => {
            this.utilService.isVipOneEnabled.next(true);
            this.utilService.isVipTwoEnabled.next(false);
          });
        }
      }
    } else if (this.vipOneFlag && this.countData?.taskCount == 20) {
      //this.utilService.getSnackBar("Please Recharge before start the tasks.")
        this.openDialog();
    }

    if (this.vipTwoFlag && this.countData?.taskCount < 40) {
      if (this.totalAmount < 1) {
        this.utilService.openDialog('Recharge', 'Please Recharge Before Start the Day Two Tasks.');
      } else {
        const dialogRef = this.dialog.open(DetailsDialogComponent);
        dialogRef.afterClosed().subscribe((result: any) => {
          this.utilService.isVipOneEnabled.next(false);
          this.utilService.isVipTwoEnabled.next(true);
        });
      }
    }

  }


  getProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      if (data) {
        let tempProducts = data.filter((item: any) => item.level === 'products');
        this.products = this.chooseRandomTwo(tempProducts);
      }
    })
  }

  chooseRandomTwo(array: any[]) {
    const randomIndexes: any = [];
    while (randomIndexes.length < 2) {
      const randomIndex = Math.floor(Math.random() * array.length);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }
    return [array[randomIndexes[0]], array[randomIndexes[1]]];
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '250px',
      data: { title: 'Task Completed', message: 'Please Recharge before start the tasks.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


