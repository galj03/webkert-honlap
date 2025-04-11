import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Post } from '../../shared/models/Post';
import { User } from '../../shared/models/User';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  //@Input() isLoggedIn: boolean = false; //TODO: get value
  cardTitle: string = "Posts";
  postForm!: FormGroup;
  isLoading: boolean = false;
  posts: Post[] = [];
  currentUser: User = {
    email: "testadmin@gmail.com",
    name: {
      firstName: "Adminus",
      lastName: "Testinus"
    },
    password: "some secure password"
  };

constructor(
    private fb: FormBuilder,
    private postSevice: PostService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPosts();
  }

  initializeForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadPosts(): void {
    this.posts = this.postSevice.getAllPosts();
    console.log("Posts loaded.");
  }

  addPost(): void {
      if (this.postForm.valid) {
        this.isLoading = true;
        const formValue = this.postForm.value;
        
        const newPost: Omit<Post, 'id'> = {
          title: formValue.title,
          content: formValue.content,
          postedBy: this.currentUser
        };
        
        this.postSevice.addPost(newPost)
          .then(addedPost => {
            console.log('New post added with promise', addedPost);
            
            this.loadPosts();
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        Object.keys(this.postForm.controls).forEach(key => {
          const control = this.postForm.get(key);
          control?.markAsTouched();
        });
      }
    }
}
