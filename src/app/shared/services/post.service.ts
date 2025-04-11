import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private currentUser: User = {
    email: "testadmin@gmail.com",
    name: {
      firstName: "Adminus",
      lastName: "Testinus"
    },
    password: "some secure password"
  };
  private posts: Post[] = [
    {
      id: 1,
      title: "The website is now underway!",
      content: "After long waiting, the WebDev String Orchestra finally has its own website.\nStay tuned for more information on our new tour!",
      postedBy: this.currentUser
    },
    {
      id: 2,
      title: "Test Tour in progress!",
      content: "Test Tour is finally underway, with its first concert in Budapest only two months away...",
      postedBy: this.currentUser
    }
  ]

  constructor() { }

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
