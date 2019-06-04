import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import _ from 'lodash';


@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  followers = [];
  user: any;
  socket: any;

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
        this.followers = data.user.followers;
        // console.log(this.followers);
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

  // checkInArray(arr, id) {
  //   const result = _.find(arr, ['follower._id', id]);
  //   if (result) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

}
