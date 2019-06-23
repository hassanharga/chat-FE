import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent, EmojiPickerOptions } from 'ng2-emoji-picker';
import _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() usersOnline;
  users_online = [];
  receiver: string;
  receiverData: any;
  user: any;
  message: any;
  messages = [];
  socket: any;
  typing = false;
  typingMessage;
  isOnline = false;

  public eventMock;
  public eventPosMock;

  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;

  constructor(
    private tokSer: TokenService,
    private msgSer: MessageService,
    private route: ActivatedRoute,
    private userSer: UsersService
  ) {
    this.socket = io('http://localhost:8080');

   }

  ngOnInit() {
    this.user = this.tokSer.getPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.user;
      this.getUserByUsername(this.receiver);

      this.socket.on('refreshPage', data => {
        this.getUserByUsername(this.receiver);
      });
    });

    // this.users_online = this.usersOnline;
    // console.log(this.users_online);
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = true;
      }
    });
    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const title = document.querySelector('.nameCol');
    if (changes.usersOnline.currentValue.length > 0) {
      const result = _.indexOf(changes.usersOnline.currentValue, this.receiver);
      console.log(changes.usersOnline.currentValue);
      if (result > -1) {
        this.isOnline = true;
        (title as HTMLElement).style.marginTop = '10px';
      } else {
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };
    this.socket.emit('join chat', params);
  }

  getUserByUsername(name) {
    this.userSer.getByUsername(name).subscribe(data => {
      this.receiverData = data.user;
      this.getMessages(this.user._id, data.user._id);
      // console.log(data);
    });
  }
  getMessages(senderId, receiverId) {
    this.msgSer.getAllMessages(senderId, receiverId).subscribe(result => {
      this.messages = result.messages.message; },
      err => console.log(err)
    );
  }

  sendMessage() {
    if (this.message) {
      // console.log(this.user);
    this.msgSer.sendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message).subscribe(
      data => {
        this.socket.emit('refresh', {});
        // console.log(data);
        this.message = '';
      },
      err => {
        console.log(err);
      }
    );
    }
  }

HandleSelection(event: EmojiEvent) {
// tslint:disable-next-line: max-line-length
    this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content;
    this.toggled = !this.toggled;
    this.content = '';
  }

HandleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }

Toggled() {
  this.toggled = !this.toggled;
  }

  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 500);
  }

}
