import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-forms',
  templateUrl: './post-forms.component.html',
  styleUrls: ['./post-forms.component.css']
})
export class PostFormsComponent implements OnInit {
 postForm: FormGroup;
  constructor(private fb: FormBuilder, private postSer: PostService) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      post : ['', Validators.required]
    });
  }
  submitPost() {
    this.postSer.addPost(this.postForm.value).subscribe(
      data => console.log(data),
      err => console.log(err)
    );
  }

}
