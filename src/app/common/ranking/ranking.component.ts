import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  @Input() data: any;
  @Input() value: any;
  user: any;

  constructor(private userService: UserService, private auth: AngularFireAuth, private firestore: AngularFirestore,
    private utilService: UtilsService) {
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
          console.log(filteredUser);
          this.user = filteredUser[0];
        }
      });

    } catch (error) {
    }
  }

  submitVipOne() {
    console.log(this.value)
    console.log("--------------")
    console.log(this.data);
    let docData = this.updateObjectById(this.value, this.data);

    console.log(docData);

    // Convert array of objects into object of objects based on id
    let objectOfObjects = docData.reduce((acc: any, obj: any) => {
      acc[obj.id] = obj;
      return acc;
    }, {});

    this.firestore.collection('vip_one').doc(this.user?.id).set(objectOfObjects)// Add user data to collection
      .then(() => {
        this.utilService.getSnackBar('Task submitted Successfully');
      })
      .catch(error => {
        console.error('Error adding Task:', error);
      });
  }

  updateObjectById(value: any, data: any) {
    return value.map((obj: any) => {
      if (obj.id === data.id) {
        let newData = { ...data, isSubmitted: true }
        return { ...obj, ...newData }; // Update properties
      } else {
        return obj; // Leave other objects unchanged
      }
    });
  }
}
