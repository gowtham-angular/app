import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs';

@Component({
  selector: 'app-withdraw-amount',
  templateUrl: './withdraw-amount.component.html',
  styleUrl: './withdraw-amount.component.scss'
})
export class WithdrawAmountComponent {
  form: FormGroup;
  user: any;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private auth: AngularFireAuth) {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      wPassword: ['', Validators.required],
    });

    this.userService.getUserData().pipe(take(1)).subscribe((users: any) => {
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
        }
      });

    } catch (error) {

    }

  }

  onSubmit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      this.userService.submitWithdrawalDetails(this.form.value, this.user.id);
    }
  }
}
