import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../service/firestore.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  rankingTasks = { imageUrl: '../../../assets/reading.png', title: 'No Ranking Tasks Available' };
  reading = { imageUrl: '../../../assets/reading.png', title: 'No Reading Tasks Available' };
  user: any;
  randomData: any;
  originalData: any;
  submittedData: any;

  constructor(private firestore: AngularFirestore,
    private userService: UserService, private auth: AngularFireAuth,
    private fireStoreService: FirestoreService) {

    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });
  }


  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.getTasks(this.user);
        }
      });

    } catch (error) {
    }
  }

  getTasks(user: any) {
    this.fireStoreService.getData('vip_one', user.id).subscribe((data: any) => {
      this.randomData = this.fireStoreService.selectRandomItem(data.arrayField);
      this.originalData = this.fireStoreService.removeSelectedItem(data.arrayField, this.randomData);
      this.getSubmittedTasks(user);
    });
  }

  getSubmittedTasks(user: any) {
    this.fireStoreService.getData('vip_one_submitted', user.id).subscribe((data: any) => {
      this.submittedData = data.arrayField;
    });
  }

}

