import { Component, Input } from '@angular/core';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from '../../service/utils.service';
import { FirestoreService } from '../../service/firestore.service';
import { Timestamp } from 'firebase/firestore';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerDialogContentComponent } from '../spinner-dialog-content/spinner-dialog-content.component';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  @Input() randomData: any;
  @Input() originalData: any;
  user: any;
  totalAmount!: number;

  constructor(private userService: UserService, private auth: AngularFireAuth, private firestore: AngularFirestore,
    private utilService: UtilsService, private firestoreService: FirestoreService, private router: Router,
    private dialog: MatDialog, private fireStoreService: FirestoreService
  ) {
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
    let docData = { ...this.randomData, isSubmitted: true, time: Timestamp.fromDate(new Date()) }
    let dataArray = [];
    dataArray.push(docData);

    const dialogRef = this.dialog.open(SpinnerDialogContentComponent, {
      disableClose: true // Prevent closing by clicking outside or pressing Escape
    });

    // Automatically close the dialog after 2 seconds
    setTimeout(() => {
      dialogRef.close({ manuallyClosed: false }); // Pass output indicating it was automatically closed
      this.firestoreService.updateSubmittedData('vip_one_submitted', this.user.id, dataArray);
      this.firestoreService.removeData('vip_one', this.user.id, this.randomData);
      this.router.navigate(['/play']);
      this.utilService.isOrderSubmitted.next(false);
    }, 2000);

    // Subscribe to the dialog's afterClosed event
    dialogRef.afterClosed().subscribe(result => {
    });
  }


 
}

