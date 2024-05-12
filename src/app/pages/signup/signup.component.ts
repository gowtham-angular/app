import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

interface ReferralId {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  form: FormGroup;

  referralIds: ReferralId[] = [
    { value: 'REF123', viewValue: 'REF123' },
    { value: 'REF456', viewValue: 'REF456' },
    { value: 'REF789', viewValue: 'REF789' },
  ];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private _router: Router) {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      referralId: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.userService.signUptoFirebase(this.form.value).then((res) => {
        this._router.navigate(['home']);
      });
    }
  }
  gotoSignin() {
    this._router.navigate(['/signin'])
  }
}
