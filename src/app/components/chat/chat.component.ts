import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  toolbarElement: any;
  online_users = [];
  constructor() { }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');

  }
  online(e) {
    this.online_users = e;
    // console.log(e);
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

}
