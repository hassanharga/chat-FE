import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {

  following = [];
  user: any;
  socket: any;

  constructor(private tokSer: TokenService, private userSer: UsersService, private router: Router) {
    // this.socket = io('http://localhost:8080');
    this.socket = io('https://chat-bee.herokuapp.com');

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
        this.following = data.user.following;
        // console.log(this.following);
      },
      err => console.log(err)
    );
  }
  // followUser(user) {
  //   this.userSer.followUser(user._id).subscribe(
  //     data => {
  //       console.log(data);
  //       this.socket.emit('refresh', {});
  //     }
  //   );
  //   // console.log(user);
  // }

  unfollowUser(user) {
    this.userSer.unfollowUser(user._id).subscribe(
      data => {console.log(data);
      this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
  }
  viewUser(user) {
    this.router.navigate(['users', user.userFollowed.username]);
    if (this.user.username !== user.userFollowed.username) {
      // console.log(user.userFollowed.username);
      this.userSer.profileNotifications(user.userFollowed._id).subscribe(
        data => { this.socket.emit('refresh', {}); },
        err => console.log(err)
      );
    }
  }

  // checkInArray(arr, id) {
  //   const result = _.find(arr, ['follower', id]);
  //   if (result) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

}
