import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  socket: any;
  post: any;
  commentsArray = [];
  constructor(private fb: FormBuilder, private postSer: PostService, private router: ActivatedRoute) {
    this.socket = io('http://localhost:8080');
   }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.router.snapshot.paramMap.get('id');
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
    this.getPost();
    this.socket.on('refreshPage', data => {
      this.getPost();
    });
  }

  addComment() {
    this.postSer.addComment(this.postId, this.commentForm.value.comment).subscribe(
      data => { console.log(data); this.commentForm.reset();
         this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
    // console.log(this.commentForm.value);
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  getPost() {
    this.postSer.getPost(this.postId).subscribe(
      data => {
        console.log(data);
        this.post = data.post.post;
        this.commentsArray = data.post.comments.reverse();
      },
      err => {
        console.log(err);
      }
    );
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

}
