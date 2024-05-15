import { Component } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { DetailsDialogComponent } from '../../common/details-dialog/details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FirestoreService } from '../../service/firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';


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
  constructor(private _productService: ProductsService,
    private userService: UserService, private auth: AngularFireAuth, private utilService: UtilsService,
    public dialog: MatDialog, private fireStoreService: FirestoreService, private fireStore : AngularFirestore
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
        let count = 0;

        this.submittedData.forEach((element: any) => {
          count += element.price;
        });
        this.totalAmount =  (count * 1.5);
        this.utilService.taskAmount.next(this.totalAmount);
        this.utilService.taskCount.next(this.totalCount);
      }
    });
  }

}


