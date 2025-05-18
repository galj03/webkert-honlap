import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { PostDateFormatterPipe } from '../../shared/pipes/post_date.pipe';
import { MatDivider } from '@angular/material/divider';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

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
    PostDateFormatterPipe,
    MatTableModule,
    MatDivider,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  postForm!: FormGroup;
  isExpanded: 'expanded' | 'not-expanded' = 'expanded';
  isLoading: boolean = false;
  posts: { post: Post, poster: User }[] = [];
  currentUser?: User | null;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private postSevice: PostService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadPosts();
    this.getCurrentUser();
  }
  
  async getCurrentUser() {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      this.userService.getUser(user)
      .then(u => {
        this.currentUser = u;
        this.isLoggedIn = u !== null;
        console.log('Current user:', this.currentUser);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initializeForm(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadPosts(): void {
    const subscription = this.postSevice.getAllPosts()
    .subscribe({
      next: (posts) => {
          this.posts = posts;
          console.log('Posts loaded with observable');
        },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
        // this.showNotification('Error loading posts', 'error');
      }
    });

    this.subscriptions.push(subscription);
  }

  addPost(): void {
      if (this.postForm.valid) {
        this.isLoading = true;
        const formValue = this.postForm.value;
        
        const newPost: Omit<Post, 'id'> = {
          title: formValue.title,
          content: formValue.content,
          postedBy: this.currentUser as User,
          date: new Date(Date.now())
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

    editPost(id: string) {
      this.router.navigate(['/edit-post', id]);
    }
}
