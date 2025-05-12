import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
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

    return this.getUserById(user.uid);
  }

  async getUserById(userId: string): Promise<User | null> {
    return new Promise(async (resolve, reject) => {
    const userDocRef = doc(this.firestore, USER_COLLECTION, userId);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      reject(new Error('User not found: '+ userId));
    }
    const userData = userDoc.data() as User;

    resolve(userData);
    });
  }
}
