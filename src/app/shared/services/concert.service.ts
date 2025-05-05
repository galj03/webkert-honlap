import { Injectable } from '@angular/core';
import { Tour } from '../models/Tour';
import { Concert } from '../models/Concert';
import { Observable, of, switchMap, firstValueFrom, take } from 'rxjs';
import { collection, query, where, getDocs, Firestore, addDoc, updateDoc } from '@angular/fire/firestore';
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
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (!user) {
        throw new Error('No authenticated user found');
      }

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

      return newConcert;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  //READ
  getAllConcerts(): Observable<Concert[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) {
          return of([]);
        }
        try {
          const userData = this.userService.getUser(user);

          const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
          const concerts: Concert[] = [];

          const q = query(concertCollection);
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            concerts.push({ ...doc.data(), id: doc.id } as Concert);
          });

          return of(concerts.sort((a, b) => {
            return a.date.toLocaleString().localeCompare(b.date.toLocaleString());
          }));
        } catch (error) {
          console.error('Error fetching concerts:', error);
          return of([]);
        }
      }),
      switchMap(concerts => concerts)
    );
  }

  getAllConcertsFromTour(currentTour: Tour): Observable<Concert[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) {
          return of([]);
        }
        try {
          const userData = this.userService.getUser(user);

          const concertCollection = collection(this.firestore, CONCERT_COLLECTION);
          const concerts: Concert[] = [];

          const q = query(concertCollection, where('tour', '==', currentTour.id)); // komplex query
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(doc => {
            concerts.push({ ...doc.data(), id: doc.id } as Concert);
          });

          return of(concerts.sort((a, b) => {
            return a.date.toLocaleString().localeCompare(b.date.toLocaleString());
          }));
        } catch (error) {
          console.error('Error fetching concerts:', error);
          return of([]);
        }
      }),
      switchMap(concerts => concerts)
    );
  }

  //TODO
  //UPDATE

  //TODO
  //DELETE
}