import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from './utils.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface User {
  userName: string,
  email: string,
  password: string,
  referralId: string,
}
@Injectable({
  providedIn: 'root'
})
export class UserService {
  lastGeneratedId!: number;
  users!: any[];
  constructor(private auth: AngularFireAuth, private utilService: UtilsService, private firestore: AngularFirestore, private _router: Router) {

    // Fetch the last generated ID from Firestore
    this.firestore.collection('id').doc('lastId').valueChanges().subscribe((data: any) => {
      this.lastGeneratedId = data.lastId;
    });

  }

  async signUptoFirebase(userData: User) {
    try {
      const id = this.generateUniqueId();
      await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
      this.utilService.getSnackBar('User Created Successfully!!!');

      this.createDefaultUser(id, userData);
    }
    catch (error: any) {
      this.utilService.getSnackBar(error);
    }
  }

  createDefaultUser(id: any, userData: User) {
    let defaultValues = {
      points: 0,
      profit: 0,
      totalAmount: 0,
      totalInvested: 0,
      id: id
    }

    let docData = {
      ...userData,
      ...defaultValues
    }

    this.firestore.collection('users').doc(id).set(docData)// Add user data to collection
      .then(() => {
        this.updateLastGeneratedId(id);
        this.utilService.getSnackBar('User Registered with ID Successfully!!!');

      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  async signIntoFirebase(userData: any) {
    try {
      await this.auth.signInWithEmailAndPassword(userData.email, userData.password);
      this.utilService.getSnackBar('User Logged In Successfully!!!');
      this._router.navigate(['/home']);
    }
    catch (error: any) {
      this.utilService.getSnackBar(error);
    }
  }

  async signout() {
    try {
      await this.auth.signOut();
      this.utilService.getSnackBar('User Signed Out');
      this._router.navigate(['/signin'])
    }
    catch (error: any) {
      this.utilService.getSnackBar(error);
    }
  }


  getUserData() {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  filterUsersByEmail(users: any, email: string): any {
    return users.filter((user: any) => user.email === email);
  }
  generateUniqueId(): string {
    let newId = this.lastGeneratedId + 1;
    while (this.checkIfIdExists(newId)) {
      newId++;
    }
    return newId.toString();
  }

  checkIfIdExists(id: number): boolean {
    // Check if the generated ID already exists in Firestore
    // You need to implement this function to query Firestore and check for the existence of the ID
    // Example: 
    // return this.firestore.collection('users').doc(id.toString()).get().toPromise().then(doc => doc.exists);
    return false; // Placeholder implementation
  }

  updateLastGeneratedId(id: string) {
    // Update the last generated ID in Firestore
    this.firestore.collection('id').doc('lastId').set({ lastId: parseInt(id, 10) });
  }

  submitBankDetails(formData: any, id: any) {
    this.firestore.collection('bankAccounts').doc(id).set(formData)// Add user data to collection
      .then(() => {
        this.updateLastGeneratedId(id);
        this.utilService.getSnackBar('Bank Details Saved Successfully!!!');

      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  getBankDetails(id: any) {
    return this.firestore.collection('bankAccounts').doc(id).valueChanges();
  }
}
