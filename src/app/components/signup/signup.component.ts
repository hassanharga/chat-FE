import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: string;
  constructor(private authSerice: AuthService, private fb: FormBuilder) { }
  signupUser() {   // create user
    console.log(this.signupForm.value);
    this.authSerice.createUser(this.signupForm.value).subscribe(
      data => {
        console.log(data);
        this.signupForm.reset();
      },
      err => {
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
