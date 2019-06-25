import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(private tokenSer: TokenService, private router: Router, private userSer: UsersService, private msgSer: MessageService) {
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
    this.socket.emit('online', {room: 'global', name: this.user.username});
    this.socket.on('refreshPage', () => {
      this.getUser();
      // console.log(data);
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data);
      // console.log(data);
    });
  }

  getUser() {
    this.userSer.getByUserId(this.user._id).subscribe(
      data => {
        this.notifications = data.user.notifications.reverse();
        this.imageVersion = data.user.picVersion;
        this.imageId = data.user.picId;
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.user.chatList;
        this.checkIfRead(this.chatList);
        // console.log(this.chatList);
      },
      err => console.log(err)
    );
  }
  checkIfRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++ ) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.senderName}`) {
        if (receiver.isRead === false && receiver.receiverName === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
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

  goToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.msgSer.markReceiverMessages(this.user.username, name).subscribe(
      data => {console.log(data); this.socket.emit('refresh', {});  },
      err => console.log(err)
    );
  }
  markAllMessages() {
    this.msgSer.markAllMessages().subscribe(
      data => {console.log(data); this.socket.emit('refresh', {}); this.msgNumber = 0; },
      err => console.log(err)
    );
  }

}
