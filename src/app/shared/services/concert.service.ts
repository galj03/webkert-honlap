import { Injectable } from '@angular/core';
import { Tour } from '../models/Tour';
import { Concert } from '../models/Concert';
import { Observable, of, switchMap, firstValueFrom, take, from } from 'rxjs';
import { collection, query, where, getDocs, Firestore, addDoc, updateDoc, orderBy, limit, doc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { CONCERT_COLLECTION } from '../constants/constants';
import { TourService } from './tour.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private tourService: TourService,
    private userService: UserService
  ) { }

  // private concertsSubject = new BehaviorSubject<Concert[]>(this.concerts);
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
  async addConcert(concert: Omit<Concert, 'id'>): Promise<Concert> {
    return new Promise<Concert>(async (resolve, reject) => {
      try {
        //TODO: check if date is between tour start and end dates

        const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
        
        const concertToSave = {
          ...concert,
          date: this.formatDateToString(concert.date)
        };
        
        const docRef = await addDoc(concertCollection, concertToSave);
        const concertId = docRef.id;
        
        await updateDoc(docRef, { id: concertId });
        
        const newConcert = {
          ...concertToSave,
          id: concertId,
          date: new Date(concertToSave.date)
        } as Concert;

        resolve(newConcert);
      } catch (error) {
        console.error('Error adding task:', error);
        reject(error);
      }
    });
  }

  //READ
  getAllConcerts(): Observable<Concert[]> {
    return from(new Promise<Concert[]>(async (resolve, reject) => {
        try {
          const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
          const concerts: Concert[] = [];

          const q = query(concertCollection, orderBy('date', 'asc'));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            concerts.push({ ...doc.data(), id: doc.id } as Concert);
          });

          resolve(concerts);
        } catch (error) {
          console.error('Error fetching concerts:', error);
          reject(error);
        }
      }));
  }

  getAllConcertsFromTour(currentTour: Tour): Observable<Concert[]> {
    return from(new Promise<Concert[]>(async (resolve, reject) => {
        try {
          const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
          const concerts: Concert[] = [];

          const q = query(concertCollection,
                          where('tour', '==', currentTour.id),
                          orderBy('date', 'asc')); // komplex query
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            concerts.push({ ...doc.data(), id: doc.id } as Concert);
          });

          resolve(concerts);
        } catch (error) {
          console.error('Error fetching concerts:', error);
          reject(error);
        }
      }));
  }

    async getConcertById(concertId: string): Promise<Concert | null>{
              return new Promise(async (resolve, reject) => {
              const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
              const q = query(concertCollection,
                              where('id', '==', concertId),
                              limit(1)); // komplex query
              const querySnapshot = await getDocs(q);
              const concertDoc = querySnapshot.docs[0];
              if (!concertDoc) {
                reject(new Error('User not found: '+ concertId));
              }
              const postData = concertDoc.data() as Concert;
          
              resolve(postData);
              });
        }

  //UPDATE
  async updateConcert(concertId: string, updatedData: Partial<Concert>): Promise<void> {
    try {
      const dataToUpdate: any = { ...updatedData };
      if (dataToUpdate.date) {
        dataToUpdate.date = this.formatDateToString(dataToUpdate.date);
      }
      console.log("progress");
      

      const concertDocRef = doc(this.firestore, CONCERT_COLLECTION, concertId);
      console.log(dataToUpdate);
      return updateDoc(concertDocRef, dataToUpdate);
    } catch (error) {
      console.error('Error updating concert:', error);
      throw error;
    }
  }

  //TODO
  //DELETE
}