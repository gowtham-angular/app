import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs';
import { DataLayerService } from '../../data-layer.service';
@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent {
  
  form: FormGroup;
  user: any;
  bankData: any;

  constructor(
    private formBuilder: FormBuilder,
    private dataLayerService: DataLayerService,
    private auth: AngularFireAuth) {

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      accountNo: ['', Validators.required],
      bank: ['', Validators.required],
      ifsc: ['', Validators.required],
      upiId: ['', Validators.required],
      wPassword: ['', Validators.required],
    });

    this.dataLayerService.getUserData().pipe(take(1)).subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });
  }

  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.dataLayerService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.getBankDetails(filteredUser[0]);
        }
      });
    } catch (error) {
      console.log("Authenticated User Failed", error);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.dataLayerService.submitBankDetails(this.form.value, this.user.id);
    }
  }

  getBankDetails(user: any) {
    this.dataLayerService.getBankDetails(user.id).subscribe((data: any) => {
      this.bankData = data;
    });
  }

}
