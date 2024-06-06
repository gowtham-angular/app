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
  getMissionFlag(id: any) {
    return this.fireStore.collection('isMissionEnabled').doc(id).valueChanges();
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

  setCookie(name: string, value: string, days?: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  eraseCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999;`;
}
}
