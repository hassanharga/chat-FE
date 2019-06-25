import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {

  toolbarElement: any;

  constructor() { }


  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

}
