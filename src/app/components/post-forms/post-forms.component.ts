import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-post-forms',
  templateUrl: './post-forms.component.html',
  styleUrls: ['./post-forms.component.css']
})
export class PostFormsComponent implements OnInit {
  socket: any;
  postForm: FormGroup;
  url = 'https://chat-bee.herokuapp.com/api/chatapp/upload-image';
  uploader: FileUploader = new FileUploader({
    url: this.url,
    disableMultipart: true
  });
  selectedFile: any;

  constructor(private fb: FormBuilder, private postSer: PostService) {
    // this.socket = io('http://localhost:8080');
    this.socket = io('https://chat-bee.herokuapp.com');

   }

  ngOnInit() {
    this.postForm = this.fb.group({
      post : ['', Validators.required]
    });
  }
  submitPost() {
    let body;
    if (!this.selectedFile) {
      body = {
        post: this.postForm.value.post
      };
    } else {
      body = {
        post: this.postForm.value.post,
        image: this.selectedFile
      };
    }
    this.postSer.addPost(body).subscribe(
      data => {
        // console.log(data);
        this.socket.emit('refresh', {});
        const filepath = <HTMLInputElement>document.getElementById('file-path');
        filepath.value = '';
        this.postForm.reset(); },
      err => console.log(err)
    );
  }

  onFileSelected(event) {
    const file: File = event[0];
    // console.log(file);
    this.readAsBase64(file)
    .then(result => {
      this.selectedFile = result;
    })
    .catch(err => {
      console.log(err);
    });
  }

  readAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', (event) => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

}
