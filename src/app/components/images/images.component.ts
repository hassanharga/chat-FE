import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  socket: any;
  user: any;
  images = [];
  url = 'http://localhost:8080/api/chatapp/upload-image';
  uploader: FileUploader = new FileUploader({
    url: this.url,
    disableMultipart: true
  });
  selectedFile: any;

  constructor( private userSer: UsersService, private tokenSer: TokenService) {
    this.socket = io('http://localhost:8080');

  }

  getUser() {
    this.userSer.getByUserId(this.user._id).subscribe(
      data => {
        this.images = data.user.images;
      },
      err => console.log(err)
    );
  }

  onFileSelected(event) {
    const file: File = event[0];
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

  upload() {
    if (this.selectedFile) {
      this.userSer.upoadImage(this.selectedFile).subscribe(
        data => {
          this.socket.emit('refresh', {});
          // console.log(data);
          const filepath = <HTMLInputElement>document.getElementById('file-path');
          filepath.value = '';
        },
        err => console.log(err)
      );
    }
    // console.log(this.selectedFile);
  }

  setProfileImage(image) {
    this.userSer.setdefaultImage(image.imgVersion, image.imgId).subscribe(
      data => { this.socket.emit('refresh', {}); },
      err => console.log(err)
    );
    // console.log(imgVersion, imgId);
  }

  ngOnInit() {
    this.user = this.tokenSer.getPayload();
    this.getUser();
    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

}
