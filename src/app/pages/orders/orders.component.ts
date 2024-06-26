import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from '../../service/firestore.service';
import { UtilsService } from '../../service/utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  rankingTasks = { imageUrl: '../../../assets/reading.png', title: 'No Ranking Tasks Available' };
  reading = { imageUrl: '../../../assets/reading.png', title: 'No Reading Tasks Available' };
  user: any;
  vipOneRandomData: any;
  vipOneOriginalData: any;
  vipTwoRandomData: any;
  vipTwoOriginalData: any;
  vipThreeRandomData: any;
  vipThreeOriginalData: any;
  submittedData: any;
  submittedVipTwoData: any;
  submittedVipThreeData: any;
  isVipOneEnabled!: boolean;
  isVipTwoEnabled!: boolean;
  isVipThreeEnabled!: boolean;
  ordersCount!: number;
  selectedFile!: File;
  uploading: boolean = false;
  fileName: string = '';
  count: any;
  uploadProgress: Observable<number | undefined> | undefined;
  constructor(
    private storage: AngularFireStorage,
    private fireStoreService: FirestoreService,
    private utilService: UtilsService,
    private dataStorageService: DataStorageService
  ) {

    this.user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.getTaskCount();
    setTimeout(() => {
      this.getVipOneTasks(this.user, 'vip_one');
      this.getVipTwoTasks('vip_two');
      this.getVipThreeTasks('vip_three');
    }, 1000)

    this.utilService.isVipOneEnabled.subscribe((flag) => {
      this.isVipOneEnabled = flag;
    })
    this.utilService.isVipTwoEnabled.subscribe((flag) => {
      this.isVipTwoEnabled = flag;
    });
    this.utilService.isVipThreeEnabled.subscribe((flag) => {
      this.isVipThreeEnabled = flag;
    });

  }

  getTaskCount() {
    let user = JSON.parse(this.dataStorageService.getCookie('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.count = data;
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;

      const filePath = `uploads/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Observe percentage changes
      this.uploadProgress = task.percentageChanges();

      // Get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            this.fireStoreService.addReadingData(this.user?.id, downloadURL)
              .then(() => {
                this.utilService.getSnackBar('Reading File added successfully.');
              })
              .catch((error: any) => {
                this.utilService.getSnackBar('Error adding product.');
                console.error('Error adding product:', error);
              }).finally(() => {
                this.uploading = false;
              });
          });
        })
      ).subscribe();
    }
  }


  getVipOneTasks(user: any, collectionName: string) {
    this.fireStoreService.getData(collectionName, user?.id).subscribe((data: any) => {
      this.vipOneRandomData = this.fireStoreService.getNextItem(data.arrayField, this.count?.taskCount);
      this.vipOneOriginalData = this.fireStoreService.removeSelectedItem(data.arrayField, this.vipOneRandomData);
      this.getSubmittedTasks(user);
    });
  }

  getVipTwoTasks(collectionName: string) {
    this.fireStoreService.getData(collectionName, this.user?.id).subscribe((data: any) => {
      if (this.count?.taskCount > 19) {
        let tempCount = this.count?.taskCount % 20;
        this.vipTwoRandomData = this.fireStoreService.getNextItem(data?.arrayField, tempCount);
      }
      this.vipTwoOriginalData = this.fireStoreService.removeSelectedItem(data?.arrayField, this.vipTwoRandomData);
      this.getSubmittedVipTwoTasks(this.user);
    });
  }

  getVipThreeTasks(collectionName: string) {
    this.fireStoreService.getData(collectionName, this.user?.id).subscribe((data: any) => {
      if (this.count?.taskCount > 19) {
        let tempCount = this.count?.taskCount % 20;
        this.vipThreeRandomData = this.fireStoreService.getNextItem(data?.arrayField, tempCount);
      }
      this.vipThreeOriginalData = this.fireStoreService.removeSelectedItem(data?.arrayField, this.vipThreeRandomData);
      this.getSubmittedVipThreeTasks(this.user);
    });
  }

  getSubmittedTasks(user: any) {
    this.fireStoreService.getData('vip_one_submitted', user.id).subscribe((data: any) => {
      if (data) {
        this.submittedData = data.arrayField;
      }
    });
  }


  getSubmittedVipTwoTasks(user: any) {
    this.fireStoreService.getData('vip_two_submitted', user.id).subscribe((data: any) => {
      this.submittedVipTwoData = data.arrayField;
    });
  }
  getSubmittedVipThreeTasks(user: any) {
    this.fireStoreService.getData('vip_three_submitted', user.id).subscribe((data: any) => {
      this.submittedVipThreeData = data.arrayField;
    });
  }


}

