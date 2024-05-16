import { Injectable } from '@angular/core';
import { Action, AngularFirestore } from '@angular/fire/compat/firestore';
import { FieldValue, arrayRemove, arrayUnion } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  // Fetch data from Firestore
  getData(collectionName: string, id: any): Observable<any> {
    return this.firestore.collection(collectionName).doc(id).valueChanges();
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
  // Combine all operations
  // getRandomAndRemove(collectionName: string): Observable<any[]> {
  //   return this.getData(collectionName).pipe(
  //     map(data => {
  //       const randomItem = this.selectRandomItem(data);
  //       const newData = this.removeSelectedItem(data, randomItem);
  //       // Optionally, you can update the Firestore collection with the new data
  //       // this.firestore.collection(collectionName).set(newData);
  //       return newData;
  //     })
  //   );
  // }

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
        console.log('Array stored successfully');
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

    dataRef.update({
      arrayField: arrayRemove(data)
    })
  }

  updateProfit(id: any, profit: any) {
    this.firestore.collection('users').doc(id).update({
      profit: profit
    });
  }
}
