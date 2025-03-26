import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-posts',
  imports: [MatCardModule],
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
