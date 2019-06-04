import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  socket: any;
  user: any;
  topPosts = [];
  constructor(private postSer: PostService, private tokser: TokenService, private router: Router) {
    this.socket = io('http://localhost:8080'); }


  ngOnInit() {
    this.user = this.tokser.getPayload();
    this.getPosts();
    this.socket.on('refreshPage', data => {
      this.getPosts();
    });

  }

  getPosts() {
    this.postSer.getAllPosts().subscribe(
      data => {this.topPosts = data.topPosts; } ,
      err => {
        console.log(err);
      }
    );
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
  timeFromNow(time) {
    return moment(time).fromNow();
  }

}

