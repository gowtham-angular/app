import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.scss'
})
export class WithdrawComponent {
  form: FormGroup;
  user: any;
  bankData: any;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private auth: AngularFireAuth) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      accountNo: ['', Validators.required],
      bank: ['', Validators.required],
      ifsc: ['', Validators.required],
      upiId: ['', Validators.required],
    });


    this.userService.getUserData().subscribe((users: any) => {
      this.getAuthenticatedUser(users);
    });

  }

  getAuthenticatedUser(users: any) {
    try {
      this.auth.user.subscribe((user: any) => {
        if (user) {
          const email = user.email;
          const filteredUser = this.userService.filterUsersByEmail(users, email);
          this.user = filteredUser[0];
          this.getBankDetails(filteredUser[0]);
        }
      });

    } catch (error) {

    }

  }

  onSubmit() {
    if (this.form.valid) {
      this.userService.submitBankDetails(this.form.value, this.user.id);
    }
  }

  getBankDetails(user: any) {
    this.userService.getBankDetails(user.id).subscribe((data: any) => {
      this.bankData = data;
    });
  }
}
