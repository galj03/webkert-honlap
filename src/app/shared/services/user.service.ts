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

  async getUser(user: FirebaseUser): Promise<User | null> {
    const userDocRef = doc(this.firestore, USER_COLLECTION, user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return null;
    }
    const userData = userDoc.data() as User;

    return userData;
  }
}
