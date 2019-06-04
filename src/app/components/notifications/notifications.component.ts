import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  user: any;
  socket: any;
  notifications = [];
  constructor(private tokSer: TokenService, private userSer: UsersService) {
    this.socket = io('http://localhost:8080');

   }

  ngOnInit() {
    this.user = this.tokSer.getPayload();
    this.getUser();
    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

  getUser() {
    this.userSer.getByUserId(this.user._id).subscribe(
      data => {
        this.notifications = data.user.notifications.reverse();
        // console.log(this.notifications);
      },
      err => console.log(err)
    );
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
  markNofification(data) {
    this.userSer.markNotification(data._id).subscribe(
      value => { console.log(value);  this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
  }
  deleteNofification(data) {
    this.userSer.markNotification(data._id, true).subscribe(
      value => { console.log(value); this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
  }

}
