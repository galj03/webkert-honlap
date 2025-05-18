import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, limit, query, where } from '@angular/fire/firestore';
import { USER_COLLECTION } from '../constants/constants';
import { User } from '../models/User';
import { User as FirebaseUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
      private firestore: Firestore
    ) { }

  async getUser(user: FirebaseUser | null): Promise<User | null> {
    if(user == null){
      return null;
    }
    console.log(user);
    
    return this.getUserByAuthId(user.uid);
  }

  async getUserByAuthId(authUserId: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
    const userCollection = collection(this.firestore, USER_COLLECTION);
    const q = query(userCollection,
                    where('authId', '==', authUserId),
                    limit(1)); // komplex query
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    if (!userDoc) {
      reject(new Error('User not found: '+ authUserId));
    }
    const userData = userDoc.data() as User;

    resolve(userData);
    });
  }

  async getUserById(authUserId: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
    const userCollection = collection(this.firestore, USER_COLLECTION);
    const q = query(userCollection,
                    where('id', '==', authUserId),
                    limit(1)); // komplex query
    const querySnapshot = await getDocs(q);
    const userDoc = querySnapshot.docs[0];
    if (!userDoc) {
      reject(new Error('User not found: '+ authUserId));
    }
    const userData = userDoc.data() as User;

    resolve(userData);
    });
  }
}
