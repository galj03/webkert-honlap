import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private currentUser: User;
  private posts: Post[] = []

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    const isLoggedIn = this.authService.isLoggedIn();
    // this.currentUser = userService.getUser(); //idk, honestly...
  }

  // private concertsSubject = new BehaviorSubject<Concert[]>(this.concerts);


  getAllPosts() {
    return this.posts.sort((a,b) => b.id - a.id);
  }

  addPost(post: Omit<Post, 'id'>): Promise<Post> {
    return new Promise((resolve) => {
      const newId = this.posts.length > 0 
        ? Math.max(...this.posts.map(c => c.id)) + 1 
        : 1;
      
      const newPost: Post = {
        ...post,
        id: newId
      };
      
      this.posts.push(newPost);
      
      //this.tasksSubject.next([...this.tasks]);
      
      setTimeout(() => {
        resolve(newPost);
      }, 1000);
    });
  }
}
