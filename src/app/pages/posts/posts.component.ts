import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{
  constructor(){
    console.log("ctor called");
  }

  ngOnInit(): void {
    console.log("onInit called");
  }
}
