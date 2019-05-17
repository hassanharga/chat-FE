import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  receiver: string;
  receiverData: any;
  user: any;
  message: any;
  constructor(
    private tokSer: TokenService,
    private msgSer: MessageService,
    private route: ActivatedRoute,
    private userSer: UsersService
  ) { }

  ngOnInit() {
    this.user = this.tokSer.getPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.user;
      // console.log(params);
    });
    this.getUserByUsername(this.receiver);
  }

  getUserByUsername(name) {
    this.userSer.getByUsername(name).subscribe(data => {
      this.receiverData = data.user;
      // console.log(data);
    });
  }

  sendMessage() {
    if (this.message) {
      console.log(this.user);
    this.msgSer.sendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message).subscribe(
      data => {
        console.log(data);
        this.message = '';
      },
      err => {
        console.log(err);
      }
    );
    }
  }

}
