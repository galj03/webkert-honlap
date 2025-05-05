import { Injectable, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { collection, addDoc, updateDoc, Firestore, getDocs, query, orderBy } from '@angular/fire/firestore';
import { firstValueFrom, Observable, of, switchMap, take } from 'rxjs';
import { POST_COLLECTION } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class PostService implements OnInit {
  private currentUser?: User | null; //mire is kell ez???
  private posts: Post[] = []

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private firestore: Firestore
  ) { }

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    this.userService.getUser(user)
    .then(u => {
      this.currentUser = u;
    });
  }

  private formatDateToString(date: Date | string): string {
    if (typeof date === 'string') {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.includes('T') ? date.split('T')[0] : date;
    }
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }
  // private concertsSubject = new BehaviorSubject<Concert[]>(this.concerts);

  //CREATE
  async addPost(post: Omit<Post, 'id'>): Promise<Post> {
      try {
        const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
        if (!user) {
          throw new Error('No authenticated user found');
        }
  
        const postCollection = collection(this.firestore, POST_COLLECTION);
        
        const postToSave = {
          ...post,
          date: this.formatDateToString(post.date)
        };
        
        const docRef = await addDoc(postCollection, postToSave);
        const postId = docRef.id;
        
        await updateDoc(docRef, { id: postId });
        
        const newPost = {
          ...postToSave,
          id: postId,
          date: new Date(postToSave.date)
        } as Post;
  
        return newPost;
      } catch (error) {
        console.error('Error adding task:', error);
        throw error;
      }
  }
  
  //READ
  getAllPosts(): Observable<Post[]> {
      return this.authService.currentUser.pipe(
        switchMap(async user => {
          if (!user) {
            return of([]);
          }
          try {
            const postCollection = collection(this.firestore, POST_COLLECTION);
            const posts: Post[] = [];
  
            const q = query(postCollection, orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
              //TODO: fix, this will fail...
              // var poster : User;
              // this.userService.getUserById(doc.data().postedBy)//pfffff
              // .then(u =>{
              //   poster = u as User;
              // });
              posts.push({ ...doc.data(), id: doc.id, /*postedBy: poster*/ } as Post);
            });
  
            return of(posts);
          } catch (error) {
            console.error('Error fetching concerts:', error);
            return of([]);
          }
        }),
        switchMap(posts => posts)
      );
    }

  //TODO
  //UPDATE

  //TODO
  //DELETE
}
