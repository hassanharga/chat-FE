import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts = [];
  constructor(private postSer: PostService) {
    this.socket = io('http://localhost:8080/');

  }

  ngOnInit() {
    this.getPosts();
    this.socket.emit('refreshPage', data => {
      this.getPosts();
    });

  }

  getPosts() {
    this.postSer.getAllPosts().subscribe(
      data => {this.posts = data.posts; } ,
      err => {
        return console.log(err);
      }
    );
  }
  timeFromNow(time) {
    return moment(time).fromNow();
  }

}
