import { Component } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { UtilsService } from '../../service/utils.service';
import { DetailsDialogComponent } from '../../common/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataStorageService } from '../../data-storage.service';


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
  displayVipThree: any;


  constructor(
    public dialog: MatDialog,
    private dataStorageService: DataStorageService,
    private utilService: UtilsService,
    private productService: ProductsService,
  ) {
    this.getProducts();

    this.user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.getTotalInvested(this.user);
    this.getVipFlags(this.user);
    this.getTaskCount();
  }

  getTaskCount() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.countData = data;
      }
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



  start() {

    // VIP ONE START 
    if (this.vipOneFlag && this.countData?.taskCount < 20) {
      if (this.user) {
        if (this.totalAmount < 1) {
          this.utilService.openDialog('Recharge', 'Please Recharge before start the tasks.');
        } else {

          const dialogRef = this.dialog.open(DetailsDialogComponent);
          dialogRef.afterClosed().subscribe((result: any) => {
              this.utilService.isVipOneEnabled.next(true);
              this.utilService.isVipTwoEnabled.next(false);
              this.utilService.isVipThreeEnabled.next(false);
          });
        }
      }
    } else if (this.vipOneFlag && this.countData?.taskCount == 20) {
      this.utilService.openDialog('Task Completed', 'Please Recharge before start the tasks');
    }

    // VIP TWO START
    if (this.vipTwoFlag && this.countData?.taskCount < 40) {
      if (this.totalAmount < 1) {
        this.utilService.openDialog('Recharge', 'Please Recharge Before Start the Day Two Tasks.');
      } else {
        const dialogRef = this.dialog.open(DetailsDialogComponent);
        dialogRef.afterClosed().subscribe((result: any) => { 
            this.utilService.isVipOneEnabled.next(false);
            this.utilService.isVipTwoEnabled.next(true);
            this.utilService.isVipThreeEnabled.next(false);
        });
      }
    } else if (this.vipTwoFlag && this.countData?.taskCount == 40) {
      this.utilService.openDialog('Task Completed', 'Please Recharge before start the tasks');
    }

    // VIP THREE STARTS

    if (this.vipThreeFlag && this.countData?.taskCount < 65) {
      if (this.totalAmount < 1) {
        this.utilService.openDialog('Recharge', 'Please Recharge Before Start the Day Three Tasks.');
      } else {
        const dialogRef = this.dialog.open(DetailsDialogComponent);
        dialogRef.afterClosed().subscribe((result: any) => {
            this.utilService.isVipOneEnabled.next(false);
            this.utilService.isVipTwoEnabled.next(false);
            this.utilService.isVipThreeEnabled.next(true);
        });
      }
    } else if (this.vipThree && this.countData?.taskCount == 65) {
      this.utilService.openDialog('Task Completed', 'Please Recharge before start the tasks');
    }

  }

  getProducts() {
    this.productService.getAllProducts().subscribe((data: any) => {
      if (data) {
        let tempProducts = data.filter((item: any) => item.level === 'products');
        this.displayVipThree = data.filter((item: any) => item.level === 'vip_3');
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
}


