import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UtilsService } from './service/utils.service';
import { ProductsService } from './service/products.service';
import { FirestoreService } from './service/firestore.service';
import { map } from 'rxjs';
import { increment, } from 'firebase/firestore';


interface User {
  userName: string,
  email: string,
  password: string,
  referralId: string,
}


@Injectable({
  providedIn: 'root'
})
export class DataLayerService {
  lastGeneratedId!: any;
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

  generateUniqueId(): string {
    let newId = this.lastGeneratedId + 1;
    while (this.checkIfIdExists(newId)) {
      newId++;
    }
    return newId.toString();
  }


  checkIfIdExists(id: number): boolean {
    //return this.firestore.collection('users').doc(id.toString()).get().toPromise().then((doc:any) => doc.exists);
    return false; // Placeholder implementation
  }

  updateLastGeneratedId(id: string) {
    // Update the last generated ID in Firestore
    this.firestore.collection('id').doc('lastId').set({ lastId: parseInt(id, 10) });
  }


  async signupUser(userData: User) {

    try {
      const id = this.generateUniqueId();
      await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
      this._utilService.getSnackBar('User Created Successfully!!!');
      this.createUserCollection(id, userData);
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
    }
  }

  async signInUser(userData: any) {
    try {
      await this.auth.signInWithEmailAndPassword(userData.email, userData.password);
      this._utilService.getSnackBar('User Logged In Successfully!!!');
      this.router.navigate(['/home']);
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
    }
  }

  async signoutUser() {
    try {
      await this.auth.signOut();
      this._utilService.getSnackBar('User Signed Out');
      this.router.navigate(['/signin']);
      localStorage.clear();
    }
    catch (error: any) {
      this._utilService.getSnackBar(error);
    }
  }

  createUserCollection(id: any, userData: User) {

    let defaultValues = { id: id };
    let docData = { ...userData, ...defaultValues };

    this.firestore.collection('users').doc(id).set(docData)
      .then(() => {
        this.updateLastGeneratedId(id);
        this._utilService.getSnackBar('User Registered with ID Successfully!!!');
        this.createTaskCountCollection(id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
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

  createTaskCountCollection(id: any) {

    let docData = { taskCount: 0 }
    this.firestore.collection('count').doc(id).set(docData)
      .then(() => {
        console.log('Task count created successfully!!!');
        this.createTotalInvestedCollection(id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }


  createTotalInvestedCollection(id: any) {

    let docData = { totalInvested: 0 }
    this.firestore.collection('total_invested').doc(id).set(docData)
      .then(() => {
        console.log('Total Invested created successfully!!!');
        this.createTotalProfitCollection(id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  createTotalProfitCollection(id: any) {
    let docData = { profit: 0 }
    this.firestore.collection('profit').doc(id).set(docData)
      .then(() => {
        console.log('Profit created successfully!!!');
        this.createMissionCollection(id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }



  createMissionCollection(id: any) {
    let docData = { missionAmount: 0 }
    this.firestore.collection('mission_amount').doc(id).set(docData)
      .then(() => {
        console.log('Mission created successfully!!!');
        this.createVipsFlagCollection(id);
        this.getProducts(id, 'vip_one');
        this.getProducts(id, 'vip_two');
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  createVipsFlagCollection(id: any) {
    let docData = [{ name: 'vipOne', value: true }, { name: 'vipTwo', value: false }, { name: 'vipThree', value: false },];
    this.firestore.collection('vip_flag_collection').doc(id).set({ data: docData })
      .then(() => {
        console.log('Vip Flags created successfully!!!');
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
          isSubmitted: false,
          missionAmount: 0
        }));

        let level = '';
        if (collectionName === "vip_one") {
          level = "vip_1";
        } else if (collectionName == "vip_two") {
          level = "vip_2";
        }
        products = newArray.filter((item: any) => item.level === level);
        this._fireStoreService.createSubmittedCollection(collectionName, id);
        this.assignVipData(id, collectionName, products);
      }
    })
  }

  assignVipData(id: any, collectionName: string, products: any) {
    let docData = products;
    let submittedCollection = `${collectionName}_submitted`
    this.firestore.collection(collectionName).doc(id).update({ arrayField: docData })// Add user data to collection
      .then(() => {
        this._fireStoreService.createSubmittedCollection(submittedCollection, id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  registerTaskCount(id: any) {
    this._utilService.registerCount(id);
  }

  getBankDetails(id: any) {
    return this.firestore.collection('bankAccounts').doc(id).valueChanges();
  }

  submitWithdrawalDetails(formData: any, id: any) {
    this.firestore.collection('submitWithdrawal').doc(id).set(formData)// Add user data to collection
      .then(() => {
        this._utilService.getSnackBar('Withdrawal Processed Sucsessfully!!!');
        this.updateBalanceAndProfit(formData, id);
        this.router.navigate(['/accounts']);

      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  submitBankDetails(formData: any, id: any) {
    this.firestore.collection('bankAccounts').doc(id).set(formData)
      .then(() => {
        this._utilService.getSnackBar('Bank Details Saved Successfully!!!');
        this.createWithdrawalPassword(formData, id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  createWithdrawalPassword(formData: any, id: any) {
    let docData = {
      wPassword: formData?.wPassword
    }
    this.firestore.collection('withdrawal_password').doc(id).set(docData)
      .then(() => {
        console.log('Withdrawal Password Saved Successfully!!!');
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  updateBalanceAndProfit(data: any, id: any) {
    this.firestore.collection('total_invested').doc(id).update({ totalInvested: increment(-(data?.amount)) })
    this.firestore.collection('profit').doc(id).update({ profit: 0 });
  }
}
