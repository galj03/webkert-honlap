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
      postedBy: this.currentUser,
      date: new Date('2025-04-10')
    },
    {
      id: 2,
      title: "Lorem ipsum",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      + "et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip"
      + " ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
      + " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      postedBy: this.currentUser,
      date: new Date('2025-04-12')
    },
    {
      id: 2,
      title: "Test Tour in progress!",
      content: "Test Tour is finally underway, with its first concert in Budapest only two months away...",
      postedBy: this.currentUser,
      date: new Date('2025-04-12')
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
