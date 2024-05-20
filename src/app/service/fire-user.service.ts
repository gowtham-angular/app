import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  // Add other user fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class FireUserService {
  user$!: any

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
   this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
}
