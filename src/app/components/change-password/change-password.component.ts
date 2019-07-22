import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  errorMessage: string;
  isError =  false;
  isDone =  false;
  passwordForm: FormGroup;
  passwordChanged: string;

  constructor( private fb: FormBuilder, private userSer: UsersService, private router: Router, private tokenSer: TokenService) { }

  changePassword() {
    // console.log(this.passwordForm.value);
    this.userSer.changePassword(this.passwordForm.value).subscribe(
      data => {
        console.log(data);
        this.isError =  false;
        this.isDone =  true;
        this.tokenSer.setToken(data.token);
        this.passwordForm.reset();
        this.passwordChanged = data.message;
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      err => {
        console.log(err);
        if (err.error.message) {
          this.errorMessage = err.error.message;
          this.isError =  true;
          this.isDone =  false;
        }
      }
    );
  }

  ngOnInit() {
    // console.log(this.tokenSer.getPayload());
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

    // if (confirm_Password.length <= 0 ) {
    //   return null;
    // }
    if (confirm_Password !== new_Password ) {
      return {
        doesNotMatch: true
      };
    }
    return null;
  }

}
