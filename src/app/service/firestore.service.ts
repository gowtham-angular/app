import { Injectable } from '@angular/core';
import { Action, AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldValue, arrayRemove, arrayUnion, increment } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  currentIndex: number = 0;
  currentItem: any;
  constructor(private firestore: AngularFirestore) { }

  // Fetch data from Firestore
  getData(collectionName: string, id: any): Observable<any> {
    return this.firestore.collection(collectionName).doc(id).valueChanges();
  }

  getNextItem(data: any, currentCounter: number): any {

    const nextCounter = currentCounter + 1;
    return data.find((obj: any) => obj.serialNo === nextCounter);
  }
  // Randomly select one item from the array
  selectRandomItem(data: any[]): any {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }

  // Remove the selected item from the original object
  removeSelectedItem(data: any[], selectedItem: any): any[] {
    return data.filter(item => item !== selectedItem);
  }

  // Update array in Firestore document
  updateArray(collectionName: string, documentId: string, updatedData: any[]): Promise<void> {
    return this.firestore.collection(collectionName).doc(documentId).update({ dataArray: updatedData });
  }

  // Store array in Firestore
  storeArray(collectionName: string, documentId: string, dataArray: any[]): Promise<void> {
    return this.firestore.collection(collectionName).doc(documentId).update({ dataArray });
  }

  createSubmittedCollection(collectionName: string, userId: any) {
    const userRef = this.firestore.collection(collectionName).doc(userId);

    // Initial array to store in Firestore
    const initialArray: any[] = [];

    userRef.set({
      arrayField: initialArray
    })
      .then(() => {
        console.log(collectionName, 'Array stored successfully');
        this.CreateMissionEnabledFlag(userId);
      })
      .catch((error) => {
        console.error('Error storing array:', error);
      });
  }

  updateSubmittedData(collectionName: string, userId: any, newValues: any) {
    const dataRef = this.firestore.collection(collectionName).doc(userId);
    dataRef.update({
      arrayField: arrayUnion(newValues[0])
    })
      .then(() => {
        console.log('New values added to array successfully');
      })
      .catch((error) => {
        console.error('Error adding new values to array:', error);
      });
  }

  removeData(collectionName: string, userId: any, data: any) {
    const dataRef = this.firestore.collection(collectionName).doc(userId);
    if (data) {
      dataRef.update({
        arrayField: arrayRemove(data)
      })
    }
    this.updateProfit(userId, (data.price) * 0.5);
    this.updateBalance(userId, (data.price * 0.5) + data?.missionAmount);
    this.updateTaskCount(userId);
  }

  updateProfit(id: any, profit: number) {
    this.firestore.collection('profit').doc(id).update({
      profit: increment(profit)
    });
  }

  updateBalance(id: any, profit: number) {
    this.firestore.collection('total_invested').doc(id).update({
      totalInvested: increment(profit)
    });
  }
  updateTaskCount(id: any) {
    this.firestore.collection('count').doc(id).update({
      taskCount: increment(1)
    });
  }

  addReadingData(id: any, downloadURL: string) {
    return this.firestore.collection('readingData').add({
      userId: id,
      url: downloadURL
    });
  }

  CreateMissionEnabledFlag(id: any) {
    this.firestore.collection('isMissionEnabled').doc(id).set({
      missionEnabled: true,
      missionAmount: 0
    });
  }
  updateMissionEnabledFlag(id: any, flag: boolean, amount: number) {
    this.firestore.collection('isMissionEnabled').doc(id).update({
      missionEnabled: flag,
      missionAmount: amount
    });
  }

  getMissionEnabledFlag(id: any, ) {
    return this.firestore.collection('isMissionEnabled').doc(id).valueChanges();
  }
}
