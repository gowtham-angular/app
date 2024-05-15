import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from '../../service/utils.service';
import { FirestoreService } from '../../service/firestore.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  @Input() randomData: any;
  @Input() originalData: any;
  user: any;

  constructor(private userService: UserService, private auth: AngularFireAuth, private firestore: AngularFirestore,
    private utilService: UtilsService, private firestoreService: FirestoreService) {
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
        }
      });

    } catch (error) {
    }
  }

  submitVipOne() {
    let docData = { ...this.randomData, isSubmitted: true }
    let dataArray = [];
    dataArray.push(docData);
    console.log(this.randomData);
   this.firestoreService.updateVipOneSubmittedData('vip_one_submitted', this.user.id, dataArray);
   this.firestoreService.removeVipOneData('vip_one', this.user.id, this.randomData);
   
  }

}