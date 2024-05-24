import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../../service/utils.service';
import { take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {

  constructor(private dataLayerService: DataLayerService) { }

  logout() {
    this.dataLayerService.signoutUser();
  }
}
