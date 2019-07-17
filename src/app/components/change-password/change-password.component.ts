import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor( private fb: FormBuilder, private userSer: UsersService) { }

  passwordForm: FormGroup;
  changePassword() {
    // console.log(this.passwordForm.value);
    this.userSer.changePassword(this.passwordForm.value).subscribe(
      data => {
        console.log(data);
        // this.passwordForm.reset();
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      cpassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required]]
      }, {
        validator: this.validate.bind(this)
      });
  }

  validate(passwordFormGroup: FormGroup) {
    const new_Password = passwordFormGroup.controls.newPassword.value;
    const confirm_Password = passwordFormGroup.controls.confirmPassword.value;
    // console.log(new_Password, confirm_Password);

    if (confirm_Password.length <= 0 ) {
      return null;
    }
    if (confirm_Password !== new_Password ) {
      return {
        doesNotMatch: true
      };
    }
    return null;
  }

}
