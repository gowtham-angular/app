import { Component, Input } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { DataStorageService } from '../../data-storage.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  user!: any;
  count!: any;
  profit!: number;
  flags: any;
  constructor(private dataStorageService: DataStorageService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getTaskCount();
    this.getVipFlags();
  }


  getTaskCount() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.count = data;
      }
    })
  }

  getVipFlags() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getVipFlags(user?.id).subscribe((item: any) => {
      if (item) {
        this.flags = item?.data.filter((val: any) =>  val.value === true)[0];
      }
    })
  }
}
