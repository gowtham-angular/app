import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../service/firestore.service';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  rankingTasks = { imageUrl: '../../../assets/reading.png', title: 'No Ranking Tasks Available' };
  reading = { imageUrl: '../../../assets/reading.png', title: 'No Reading Tasks Available' };
  user: any;
  vipOneRandomData: any;
  vipOneOriginalData:
    any;
  vipTwoRandomData: any;
  vipTwoOriginalData:
    any;
  submittedData: any;
  submittedVipTwoData: any;
  isOrderSubmitted!: boolean;
  isVipTwoEnabled!: boolean;
  ordersCount!: number;

  constructor(private firestore: AngularFirestore,
    private userService: UserService, private auth: AngularFireAuth,
    private fireStoreService: FirestoreService,
    private utilService: UtilsService
  ) {

    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });

    this.utilService.isOrderSubmitted.subscribe((flag: boolean) => {
      this.isOrderSubmitted = flag;
    });

    this.utilService.taskCount.subscribe((count: number) => {
      this.ordersCount = count;
    })

   
  }


  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.getVipOneTasks(this.user, 'vip_one');
          this.utilService.isVipTwoEnabled.subscribe((flag: boolean) => {
            this.isVipTwoEnabled = flag;
            if (flag) {
              this.getVipTwoTasks('vip_two');
            }
          });
        }
      });

    } catch (error) {
    }
  }

  getVipOneTasks(user: any, collectionName: string) {
    this.fireStoreService.getData(collectionName, user?.id).subscribe((data: any) => {
      this.vipOneRandomData = this.fireStoreService.selectRandomItem(data.arrayField);
      this.vipOneOriginalData = this.fireStoreService.removeSelectedItem(data.arrayField, this.vipOneRandomData);
      this.getSubmittedTasks(user);

    });
  }

  getVipTwoTasks(collectionName: string) {
    this.fireStoreService.getData(collectionName, this.user?.id).subscribe((data: any) => {
      this.vipTwoRandomData = this.fireStoreService.selectRandomItem(data.arrayField);
      this.vipTwoOriginalData = this.fireStoreService.removeSelectedItem(data.arrayField, this.vipTwoRandomData);
      this.getSubmittedVipTwoTasks(this.user);
    });
  }


  getSubmittedTasks(user: any) {
    this.fireStoreService.getData('vip_one_submitted', user.id).subscribe((data: any) => {
      this.submittedData = data.arrayField;
    });
  }


  getSubmittedVipTwoTasks(user: any) {
    this.fireStoreService.getData('vip_two_submitted', user.id).subscribe((data: any) => {
      this.submittedVipTwoData = data.arrayField;
    });
  }

}

