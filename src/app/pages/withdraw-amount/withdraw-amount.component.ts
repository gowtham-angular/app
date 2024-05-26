import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
import { DataStorageService } from '../../data-storage.service';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-withdraw-amount',
  templateUrl: './withdraw-amount.component.html',
  styleUrl: './withdraw-amount.component.scss'
})
export class WithdrawAmountComponent {
  form: FormGroup;
  user: any;
  password: any;
  totalInvested: any;
  count: any;
  constructor(
    private formBuilder: FormBuilder,
    private dataLayerService: DataLayerService,
    private dataStorageService: DataStorageService,
    private utilService: UtilsService
  ) {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      wPassword: ['', Validators.required],
    });
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.getAccountBalance();
    this.getTaskCount();
  }


  onSubmit() {
    if (this.form.valid) {

      if (this.count?.taskCount === 20 || this.count?.taskCount > 39) {
        this.getWithdrawalPassword();
      } else {
        this.utilService.openDialog('withdrawal','Complete the tasks to withdrawal');
      }
    }
  }

  getWithdrawalPassword() {

    this.dataStorageService.getWithdrawalPassword(this.user?.id).subscribe((data: any) => {
      if (data) {
        this.password = data?.wPassword;
        if (this.password === this.form.value?.wPassword) {
          if (this.form.value?.amount <= this.totalInvested?.totalInvested) {
            this.dataLayerService.submitWithdrawalDetails(this.form.value, this.user.id);
          } else {
            this.utilService.openDialog('withdrawal','Enter the correct amount to withdraw');
          }
        } else {
          this.utilService.openDialog('withdrawal','Enter the correct password to withdraw');
        }
      } else {
        this.utilService.openDialog('withdrawal','Please Enter Withdrawal Details');
      }
    });


  }


  getAccountBalance() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getAccountBalance(user?.id).subscribe((data) => {
      if (data) {
        this.totalInvested = data;
        this.setAmount();
      }
    })
  }

  setAmount() {
    this.form.setValue({
      amount: this.totalInvested?.totalInvested,
      wPassword: ''
    });
  }

  getTaskCount() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.dataStorageService.getCount(user?.id).subscribe((data) => {
      if (data) {
        this.count = data;
      }
    })
  }
}
