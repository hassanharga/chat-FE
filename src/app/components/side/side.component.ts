import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  socket: any;
  user: any;
  userData: any;
  constructor(private userSer: UsersService, private tokser: TokenService) {
    // this.socket = io('http://localhost:8080');
    this.socket = io('https://chat-bee.herokuapp.com');

  }

  getUser() {
    this.userSer.getByUserId(this.user._id).subscribe(
      data => {
        this.userData = data.user;
        // console.log(this.userData);
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    this.user = this.tokser.getPayload();
    this.getUser();
    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

}
