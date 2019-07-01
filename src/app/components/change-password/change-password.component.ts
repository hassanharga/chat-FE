import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor( private fb: FormBuilder) { }

  passwordForm: FormGroup;
  changePassword() {

  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      cpassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: this.validate.bind(this)
    });
  }

  validate(passwordFormGroup: FormGroup) {
    const new_Password = passwordFormGroup.controls.newPassword.value;
    const confirm_Password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_Password.length <= 0 ) {
      return null;
    }
    if (confirm_Password.length !== new_Password ) {
      return {
        doesNotMatch: true
      };
    }
    return null;
  }

}
