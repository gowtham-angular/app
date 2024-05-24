import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { increment, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, flatMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  taskCount = new BehaviorSubject<number>(0);
  profit = new BehaviorSubject<number>(0);
  totalInvested = new BehaviorSubject<number>(0);
  missionAmount = new BehaviorSubject<number>(0);
  isVipOneActivated = new BehaviorSubject<boolean>(false);
  isVipTwoActivated = new BehaviorSubject<boolean>(false);
  userData = new BehaviorSubject({});

  constructor(
    private fireStore: AngularFirestore
  ) { }

  getAccountBalance(id: any) {
    return this.fireStore.collection('total_invested').doc(id).valueChanges();
  }
  getProfit(id: any) {
    return this.fireStore.collection('profit').doc(id).valueChanges();
  }
  getCount(id: any) {
    return this.fireStore.collection('count').doc(id).valueChanges();
  }
  getMissionAmount(id: any) {
    return this.fireStore.collection('mission_amount').doc(id).valueChanges();
  }

  getWithdrawalPassword(id: any) {
    return this.fireStore.collection('withdrawal_password').doc(id).valueChanges();
  }

  getVipFlags(id: any) {
    return this.fireStore.collection('vip_flag_collection').doc(id).valueChanges();
  }

  updateVipTwoFlags(id: any) {
    let docData = [{ name: 'vipOne', value: true }, { name: 'vipTwo', value: false }, { name: 'vipThree', value: false },];
    this.fireStore.collection('vip_flag_collection').doc(id).update({ docData })
  }
}
