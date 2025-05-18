import { Injectable, OnInit } from '@angular/core';
import { FirebasePost, Post } from '../models/Post';
import { User } from '../models/User';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { collection, addDoc, updateDoc, Firestore, getDocs, query, orderBy, collectionData, limit, where, doc, deleteDoc } from '@angular/fire/firestore';
import { first, firstValueFrom, map, Observable, of, Subscriber, switchMap, take, from } from 'rxjs';
import { POST_COLLECTION, USER_COLLECTION } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private firestore: Firestore
  ) { }

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

  //CREATE
  async addPost(post: Omit<FirebasePost, 'id'>): Promise<FirebasePost> {
      return new Promise<FirebasePost>(async (resolve, reject) => {
      try {
        const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
        if (!user) {
          const e = new Error('No authenticated user found');
          reject(e);
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
          id: postId
        } as FirebasePost;
  
        resolve(newPost);
      } catch (error) {
        console.error('Error adding task:', error);
        reject(error);
      }
    });
  }
  
  //READ
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

                  posts.push({post: { ...doc.data(), id: doc.id, date: new Date(post.date) } as Post,
                    poster: poster as User});
              });
    
              resolve(posts);
            
          } catch (error) {
            console.error('Error fetching posts:', error);
            reject(error);
          }
      }));
    }
    
    async getPostById(postId: string): Promise<Post | null>{
          return new Promise(async (resolve, reject) => {
          const postCollection = collection(this.firestore, POST_COLLECTION);
          const q = query(postCollection,
                          where('id', '==', postId),
                          limit(1)); // komplex query
          const querySnapshot = await getDocs(q);
          const postDoc = querySnapshot.docs[0];
          if (!postDoc) {
            reject(new Error('User not found: '+ postId));
          }
          const post = postDoc.data() as FirebasePost;
          const postData = { ...postDoc.data(), id: postDoc.id, date: new Date(post.date) } as Post;
      
          resolve(postData);
          });
    }

  //UPDATE
  async updatePost(postId: string, updatedData: Partial<Post>): Promise<void> {
      try {
        const dataToUpdate: any = { ...updatedData };
        if (dataToUpdate.date) {
          dataToUpdate.date = this.formatDateToString(dataToUpdate.date);
        }
        console.log("progress");
        
  
        const postDocRef = doc(this.firestore, POST_COLLECTION, postId);
        console.log(dataToUpdate);
        return updateDoc(postDocRef, dataToUpdate);
      } catch (error) {
        console.error('Error updating post:', error);
        throw error;
      }
    }

  //DELETE
  async deletePost(postId: string): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const postDocRef = doc(this.firestore, POST_COLLECTION, postId);
      await deleteDoc(postDocRef);

      return;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}
