import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingSubject.asObservable();

  isOrderSubmitted = new BehaviorSubject<boolean>(false);
  taskCount = new BehaviorSubject(0);
  amount = new BehaviorSubject(0);
  taskAmount = new BehaviorSubject(0);
  constructor(private snackBar: MatSnackBar) { }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

  getSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000 // Duration in milliseconds
    });
  }
}
