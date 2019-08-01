import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string;
  showspinner = false;
  constructor(private authSerice: AuthService, private fb: FormBuilder, private router: Router, private tokenSer: TokenService) { }
  signupUser() {   // create user
    // console.log(this.signupForm.value);
    this.authSerice.createUser(this.signupForm.value).subscribe(
      data => {
        this.showspinner = true;
        // console.log(data);
        this.tokenSer.setToken(data.token);
        // localStorage.setItem('token',data.token);
        // this.signupForm.reset();
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      err => {
        this.showspinner = false;
        console.log(err);
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
  ngOnInit() {
    this.signupForm = this.fb.group({ // validating form
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

}
