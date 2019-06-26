import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as M from 'materialize-css';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {

  toolbarElement: any;
  postTab = false;
  followingTab = false;
  followerTab = false;
  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;
  socket: any;
  picVersion: any;
  picId: any;

// tslint:disable-next-line: max-line-length
  constructor(private postSer: PostService, private router: Router, private route: ActivatedRoute, private userSer: UsersService, private tokser: TokenService) {
    this.socket = io('http://localhost:8080');
  }


  ngOnInit() {
    this.postTab = true;
    this.user = this.tokser.getPayload();
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.toolbarElement = document.querySelector('.nav-content');
    this.route.params.subscribe(params => {
      this.name = params.name;
      this.getUserByName(this.name);
    });
    this.socket.on('refreshPage', data => {
      this.getUserByName(this.name);
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }
  getUserByName(name) {
    this.userSer.getByUsername(name).subscribe(
      data => {
        this.posts = data.user.posts;
        this.following = data.user.following;
        this.followers = data.user.followers;
        this.picVersion = data.user.picVersion;
        this.picId = data.user.picId;
        console.log(data);
        // console.log(this.posts);
        // console.log(this.following);
        // console.log(this.followers);
      },
      err => console.log(err)
    );

  }
  timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postSer.addLike(post).subscribe(
      data => {console.log('you Liked the post'); this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
  }
  checkInLikesArray(arr, username) {
    return _.some(arr, {username: username});
  }
  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }

  changeTabs(tab) {
    if (tab === 'posts') {
      this.postTab = true;
      this.followingTab = false;
      this.followerTab = false;
    } else if (tab === 'following') {
      this.followingTab = true;
      this.postTab = false;
      this.followerTab = false;
    } else {
      this.followingTab = false;
      this.postTab = false;
      this.followerTab = true;
    }
  }

}
