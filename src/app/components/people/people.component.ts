import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { ClassField } from '@angular/compiler';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  socket: any;
  users = [];
  userArr = [];
  loggedinUser: any;
  online_users = [];
  // isOnline = false;

  constructor(private userSer: UsersService, private tokSer: TokenService, private router: Router) {
    this.socket = io('http://localhost:8080');
  }

  ngOnInit() {
    this.loggedinUser = this.tokSer.getPayload();
    this.getUsers();
    this.getUserById();
    this.socket.on('refreshPage', data => {
      this.getUsers();
      this.getUserById();
    });

    // this.getUserByUsername();
  }

  online(e) {
    this.online_users = e;
    // console.log(this.online_users);
  }

  checkIfOnline(name) {
      const result = _.indexOf(this.online_users, name);
      // console.log(result);
      if (result > -1) {
        return true;
      } else {
        return false;
      }
  }

  getUsers() {
    this.userSer.getAllUsers().subscribe(
      data => {
        _.remove(data.users, {username: this.loggedinUser.username });
        // console.log(data);
        this.users = data.users;
      }
    );
  }

  getUserById() {
    this.userSer.getByUserId(this.loggedinUser._id).subscribe(
      data => {
        // console.log(data);
        this.userArr = data.user.following;
      }
    );
  }

  getUserByUsername() {
    this.userSer.getByUserId(this.loggedinUser.username).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  followUser(user) {
    this.userSer.followUser(user._id).subscribe(
      data => {
        // console.log(data);
        this.socket.emit('refresh', {});
      }
    );
    // console.log(user);
  }

  checkInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  viewUser(user) {
    this.router.navigate(['users', user.username]);
    if (this.loggedinUser.username !== user.username) {
      // console.log(user.username);
      this.userSer.profileNotifications(user._id).subscribe(
        data => {console.log(data); this.socket.emit('refresh', {}); },
        err => console.log(err)
      );
    }
  }

}
