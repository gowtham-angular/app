import { Component, OnDestroy } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { DetailsDialogComponent } from '../../common/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnDestroy {

  products: any;
  user: any;
  submittedData: any;
  totalCount!: number;
  totalAmount!: number;
  totalCountFlag!: boolean;
  vipTwoFlag!: boolean;
  isMissionComplete!: boolean;

  constructor(private _productService: ProductsService,
    private userService: UserService, private auth: AngularFireAuth, private utilService: UtilsService,
    public dialog: MatDialog, private fireStoreService: FirestoreService, private fireStore: AngularFirestore
  ) {
    this.getProducts();
    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
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
        this.utilService.isMissionComplete.next(true);
        if (this.user?.totalAmount < 1500) {
          this.utilService.getSnackBar("Please Recharge Before Start the Day Two Tasks.");
        } else {

          this.utilService.getCount(this.user?.id).pipe(take(1)).subscribe((data: any) => {
            if (data) {
              let count = data.count;

              if (count === 38) {
                this.fireStore.collection('users').doc(this.user.id).update({
                  totalInvested: -1555
                })
              }

              if (count === 40) {
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
        this.utilService.isMissionComplete.next(false);
        this.utilService.getSnackBar("Please complete the mission");
      }

    }
  }

  getProducts() {
    this._productService.getAllProducts().subscribe((data: any) => {
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

  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];

          this.getSubmittedTasks(this.user)
        }
      });

    } catch (error) {

    }

  }

  getSubmittedTasks(user: any) {
    this.fireStoreService.getData('vip_one_submitted', user.id).subscribe((data: any) => {
      if (data) {
        this.submittedData = data.arrayField;
        this.totalCount = this.submittedData?.length;

        if (this.totalCount > 19) {
          this.totalCountFlag = true;
          this.vipTwoFlag = true;

        } else {
          this.totalCountFlag = false;
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

  ngOnDestroy() {

  }
}


