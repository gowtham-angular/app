import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConfirmationBoxComponent } from '../common/confirmation-box/confirmation-box.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  isVipOneEnabled = new BehaviorSubject<boolean>(false);
  isVipTwoEnabled = new BehaviorSubject<boolean>(false);
  isVipThreeEnabled = new BehaviorSubject<boolean>(false);
  taskCount = new BehaviorSubject(0);
  amount = new BehaviorSubject(0);
  taskAmount = new BehaviorSubject(0);
  isMissionComplete = new BehaviorSubject<boolean>(false);

  constructor(
    private snackBar: MatSnackBar,
    private fireStore: AngularFirestore,
    private dialog: MatDialog
  ) { }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  getSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000 // Duration in milliseconds
    });
  }

  registerCount(id: any) {
    this.fireStore.collection('count').doc(id).set({ count: 0 })
  }

  updateCount(id: any, count: number) {
    this.fireStore.collection('count').doc(id).update({ count: count })
  }

  getCount(id: any) {
    return this.fireStore.collection('count').doc(id).valueChanges();
  }

  openDialog(title: string, message: string): void {
    const dialogRef = this.dialog.open(ConfirmationBoxComponent, {
      width: '250px',
      data: { title: title, message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
