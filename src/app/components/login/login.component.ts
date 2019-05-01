import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  showspinner = false;
  constructor(private fb: FormBuilder, private authSer: AuthService, private router: Router, private tokenSer: TokenService) { }
  loginUser() {
    console.log(this.loginForm.value);
    this.authSer.loginUser(this.loginForm.value).subscribe(
      data => {
        this.showspinner = true;
        console.log(data);
        this.tokenSer.setToken(data.token);
        // localStorage.setItem('token',data.token);
        // this.loginForm.reset();
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      err => {
        this.showspinner = false;
        console.log(err);
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
  ngOnInit() {
    this.loginForm = this.fb.group({ // validating form
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

}
