import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private tokenSer: TokenService, private router: Router) { }

  ngOnInit() {
  }
  logout() {
    this.tokenSer.deleteToken();
    this.router.navigate(['']);
  }

}
