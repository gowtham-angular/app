import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from './utils.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';
import { FirestoreService } from './firestore.service';

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
  products!: any[];
  
  constructor(
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore, 
    private router: Router,
    private _utilService: UtilsService,
    private _productService: ProductsService,
    private _fireStoreService: FirestoreService) {

    // Fetch the last generated ID from Firestore
    this.firestore.collection('id').doc('lastId').valueChanges().subscribe((data: any) => {
      this.lastGeneratedId = data.lastId;
    });

  }

  async signUptoFirebase(userData: User) {
    try {
      const id = this.generateUniqueId();
      await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
      this._utilService.getSnackBar('User Created Successfully!!!');
      this.createDefaultUser(id, userData);
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
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

    this.firestore.collection('users').doc(id).set(docData)
      .then(() => {
        this.updateLastGeneratedId(id);
        this._utilService.getSnackBar('User Registered with ID Successfully!!!');
        this.getProducts(id, 'vip_one');
        this.getProducts(id, 'vip_two');
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }



  assignVipData(id: any, collectionName: string, products: any) {
    console.log("products", products);
    let docData = products;
    let submittedCollection  = `${collectionName}_submitted`
    this.firestore.collection(collectionName).doc(id).update({ arrayField: docData })// Add user data to collection
      .then(() => {
        this._fireStoreService.createSubmittedCollection(submittedCollection, id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }


  getProducts(id: any, collectionName: string) {
    let products = [];
    this._productService.getAllProducts().subscribe((data: any) => {
      if (data) {
        let newArray = data.map((obj: any) => ({
          ...obj,
          isSubmitted: false
        }));
       
        let level = '';
        if(collectionName === "vip_one"){
          level = "vip_1";
        }else if(collectionName == "vip_two") {
          level = "vip_2";
        }
        products= newArray.filter((item: any) => item.level === level);
        this._fireStoreService.createSubmittedCollection(collectionName, id);
        this.assignVipData(id, collectionName, products);
      }
    })
  }
  async signIntoFirebase(userData: any) {
    try {
      await this.auth.signInWithEmailAndPassword(userData.email, userData.password);
      this._utilService.getSnackBar('User Logged In Successfully!!!');
      this.router.navigate(['/home']);
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
    }
  }

  async signout() {
    try {
      await this.auth.signOut();
      this._utilService.getSnackBar('User Signed Out');
      this.router.navigate(['/signin'])
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
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
    this.registerTaskCount(id)
  }

  submitBankDetails(formData: any, id: any) {
    this.firestore.collection('bankAccounts').doc(id).set(formData)// Add user data to collection
      .then(() => {
        this.updateLastGeneratedId(id);
        this._utilService.getSnackBar('Bank Details Saved Successfully!!!');

      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  getBankDetails(id: any) {
    return this.firestore.collection('bankAccounts').doc(id).valueChanges();
  }

  registerTaskCount(id: any) {
    this._utilService.registerCount(id);
  }
}
