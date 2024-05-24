import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  isVipOneEnabled = new BehaviorSubject<boolean>(false);
  taskCount = new BehaviorSubject(0);
  amount = new BehaviorSubject(0);
  taskAmount = new BehaviorSubject(0);
  isVipTwoEnabled = new BehaviorSubject<boolean>(false);
  isMissionComplete = new BehaviorSubject<boolean>(false);

  constructor(
    private snackBar: MatSnackBar,
    private fireStore: AngularFirestore
  ) { }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  getSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000 // Duration in milliseconds
    });
  }

  registerCount(id: any){
    this.fireStore.collection('count').doc(id).set({count: 0})
  }

  updateCount(id: any, count: number) {
    this.fireStore.collection('count').doc(id).update({count: count})
  }

  getCount(id: any) {
    return this.fireStore.collection('count').doc(id).valueChanges();
  }
}
