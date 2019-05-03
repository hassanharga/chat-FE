import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-post-forms',
  templateUrl: './post-forms.component.html',
  styleUrls: ['./post-forms.component.css']
})
export class PostFormsComponent implements OnInit {
  socket: any;
  postForm: FormGroup;
  constructor(private fb: FormBuilder, private postSer: PostService) {
    this.socket = io('http://localhost:8080');
   }

  ngOnInit() {
    this.postForm = this.fb.group({
      post : ['', Validators.required]
    });
  }
  submitPost() {
    this.postSer.addPost(this.postForm.value).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
        this.postForm.reset(); },
      err => console.log(err)
    );
  }

}
