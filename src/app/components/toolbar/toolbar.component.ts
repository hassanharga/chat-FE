import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;
  constructor(private tokenSer: TokenService, private router: Router) { }

  ngOnInit() {
    this.user = this.tokenSer.getPayload();
  }
  logout() {
    this.tokenSer.deleteToken();
    this.router.navigate(['']);
  }
  goToHome() {
    this.router.navigate(['streams']);
  }

}
