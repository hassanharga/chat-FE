import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];

  constructor(private tokenSer: TokenService, private router: Router, private userSer: UsersService) {
    this.socket = io('http://localhost:8080');
  }

  ngOnInit() {
    this.user = this.tokenSer.getPayload();
    this.getUser();
    const dropdown = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdown, {
      alignment: 'right',
      // hover: true,
      coverTrigger: false
    });

    const dropdown1 = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropdown1, {
      alignment: 'left',
      // hover: true,
      coverTrigger: false
    });
    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

  getUser() {
    this.userSer.getByUserId(this.user._id).subscribe(
      data => {
        this.notifications = data.user.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.user.chatList.reverse();
        console.log(this.chatList);
      },
      err => console.log(err)
    );
  }
  timeFromNow(time) {
    return moment(time).fromNow();
  }
  messageDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }
  markAll() {
    this.userSer.markAllNotification().subscribe(
      data => { console.log(data); this.socket.emit('refresh', {}); }
    );
  }
  logout() {
    this.tokenSer.deleteToken();
    this.router.navigate(['']);
  }
  goToHome() {
    this.router.navigate(['streams']);
  }

}
