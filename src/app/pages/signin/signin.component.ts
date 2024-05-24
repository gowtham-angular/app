import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataLayerService } from '../../data-layer.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private dataLayerService: DataLayerService, 
    private _router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dataLayerService.signInUser(this.form.value)
    }
  }
  gotoSignup() {
    this._router.navigate(['/signup'])
  }
}
