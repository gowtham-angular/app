import { Component, OnDestroy } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { DetailsDialogComponent } from '../../common/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, take } from 'rxjs';


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
  vipTwoFlag!: boolean;
  isMissionComplete!: boolean;


  constructor(
    private fireStore: AngularFirestore,
    private auth: AngularFireAuth,
    public dialog: MatDialog,
    private userService: UserService,
    private utilService: UtilsService,
    private fireStoreService: FirestoreService,
    private productService: ProductsService,
  ) {
    this.getProducts();
    this.userService.getUserData().pipe(take(1)).subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });
  }

  getAuthenticatedUser(users: any) {
    this.auth.user.subscribe((user: any) => {
      if (user) {
        const email = user.email;
        const filteredUser = this.userService.filterUsersByEmail(users, email);
        this.user = filteredUser[0];
      }
    });
    setTimeout(() => {
      this.getSubmittedTasks(this.user);
    }, 1000)

  }

  getSubmittedTasks(user: any) {
    this.fireStoreService.getData('vip_one_submitted', user.id).subscribe((data: any) => {
      if (data) {
        this.submittedData = data.arrayField;
        this.totalCount = this.submittedData?.length;

        if (this.totalCount > 19 && this.totalCount <= 39) {
          this.totalCountFlag = true;
          this.vipTwoFlag = true;
        } else if (this.totalCount > 39) {
          this.totalCountFlag = true;
          this.vipTwoFlag = false;
        } else {
          this.vipTwoFlag = false;
        }
        let count = 0;

        this.submittedData.forEach((element: any) => {
          count += element.price;
        });
        this.totalAmount = (count * 1.5);
        this.utilService.taskAmount.next(this.totalAmount);
        this.utilService.updateCount(this.user?.id, this.totalCount);
        this.fireStoreService.updateProfit(this.user?.id, this.totalAmount)
      }
    });
  }

  start() {
    if (this.user) {
      if (this.user?.totalAmount < 1) {
        this.utilService.getSnackBar("Please Recharge before start the tasks.")
      } else {
        const dialogRef = this.dialog.open(DetailsDialogComponent);
        dialogRef.afterClosed().subscribe((result: any) => {
          this.utilService.isOrderSubmitted.next(true);
        });
      }

    }
  }

  startVipTwo() {
    if (this.user) {
      if (this.user.totalInvested >= 0) {
        this.isMissionComplete = true;
        this.utilService.isMissionComplete.next(false);
        if (this.user?.totalAmount < 1500) {
          this.utilService.getSnackBar("Please Recharge Before Start the Day Two Tasks.");
        } else {
          this.utilService.getCount(this.user?.id).subscribe((data: any) => {
            if (data) {
              let count = data.count;
              if (count === 37) {
                this.fireStore.collection('users').doc(this.user.id).update({
                  totalInvested: -1555
                })
              }
              if (count === 39) {
                this.fireStore.collection('users').doc(this.user.id).update({
                  totalInvested: -555
                })
              }

            }

          })
          const dialogRef = this.dialog.open(DetailsDialogComponent);
          dialogRef.afterClosed().subscribe((result: any) => {
            this.utilService.isVipTwoEnabled.next(true);
          });
        }
      } else {
        this.isMissionComplete = false;
        this.utilService.isMissionComplete.next(true);
        const dialogRef = this.dialog.open(DetailsDialogComponent);
        dialogRef.afterClosed().subscribe((result: any) => {
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

}


