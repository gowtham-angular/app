import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  rankingTasks = { imageUrl: '../../../assets/reading.png', title: 'No Ranking Tasks Available' };
  reading = { imageUrl: '../../../assets/reading.png', title: 'No Reading Tasks Available' };
  user: any;
  randomObject: any;
  filteredArray: any;
  constructor(private firestore: AngularFirestore, private userService: UserService, private auth: AngularFireAuth) {

    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });
  }


  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        console.log('dataasas', user);
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          console.log(filteredUser);
          this.user = filteredUser[0];
          this.getTasks(this.user);
        }
      });

    } catch (error) {
    }
  }

  getTasks(user: any) {
    // Filter objects where isSubmitted is false
    this.firestore.collection('vip_one').doc(user.id).valueChanges().subscribe((data: any) => {

      let arrayOfObjects = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      this.filteredArray = arrayOfObjects.filter((obj: any) => !obj.isSubmitted);
      let randomIndex = Math.floor(Math.random() * this.filteredArray.length);
      this.randomObject = this.filteredArray[randomIndex];

      console.log("random object", this.randomObject);
    });
  }


}

