import { Injectable, OnInit } from '@angular/core';
import { FirebasePost, Post } from '../models/Post';
import { User } from '../models/User';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { collection, addDoc, updateDoc, Firestore, getDocs, query, orderBy, collectionData } from '@angular/fire/firestore';
import { first, firstValueFrom, map, Observable, of, Subscriber, switchMap, take, from } from 'rxjs';
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
  //   getAllPosts(): Observable<{
  //   post:Post,
  //   poster: User
  // }[]> {
      // return collectionData(collection(this.firestore, 'POST_COLLECTION')).pipe(
      //   // turn off
      //   first(),
      //   map((doc: any) => {
      //       return { ...doc.data(), id: doc.id, /*postedBy: poster*/ } as Post;
      //   })
      // );

  getAllPosts(): Observable<{
    post:Post,
    poster: User
  }[]> {
      return from(new Promise<{
              post:Post,
              poster: User
            }[]>(async (resolve, reject) => {
          try {
            const postCollection = collection(this.firestore, POST_COLLECTION);
            const posts: {
              post:Post,
              poster: User
            }[] = [];
  
            const q = query(postCollection, orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
              querySnapshot.forEach(async doc => {
                const post = { ...doc.data(), id: doc.id } as FirebasePost;
                var poster : User;
                var u = await this.userService.getUserById(post.postedBy);
                  poster = u as User;

                  posts.push({post: { ...doc.data(), id: doc.id } as Post,
                    poster: poster as User});
              });
    
              resolve(posts);
            
          } catch (error) {
            console.error('Error fetching posts:', error);
            reject(error);
          }
      }));
    }

  //TODO
  //UPDATE

  //TODO
  //DELETE
}
