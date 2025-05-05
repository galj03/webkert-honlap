import { Injectable } from '@angular/core';
import { Tour } from '../models/Tour';
import { Concert } from '../models/Concert';
import { Observable, BehaviorSubject, of, switchMap } from 'rxjs';
import { doc, getDoc, collection, query, where, getDocs, Firestore } from '@angular/fire/firestore';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { CONCERT_COLLECTION, USER_COLLECTION } from '../constants/constants';
import { User as FirebaseUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  private currentTour: Tour = {
      id: '1',
      title: "Test Tour",
      startYear: 2024,
      endYear: 2025
  }
  private concerts: Concert[] = [
    {
      id: '1',
      venue: "Budapest Park",
      place: "Budapest, Hungary",
      date: new Date('2025-06-25'),
      tour: this.currentTour.id
    },
    {
      id: '2',
      venue: "Puskás Aréna",
      place: "Budapest, Hungary",
      date: new Date('2025-06-26'),
      tour: this.currentTour.id
    },
    {
      id: '3',
      venue: "Pick Aréna",
      place: "Szeged, Hungary",
      date: new Date('2025-07-05'),
      tour: this.currentTour.id
    },
  ]

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) { }

  // private concertsSubject = new BehaviorSubject<Concert[]>(this.concerts);

  //CREATE
  //TODO
  addConcert(concert: Omit<Concert, 'id'>): Promise<Concert> {
    return new Promise((resolve) => {
      const newId = this.concerts.length > 0 
        ? Math.max(...this.concerts.map(c => c.id)) + 1 
        : 1;
      
      const newConcert: Concert = {
        ...concert,
        id: newId
      };
      
      this.concerts.push(newConcert);
      
      //this.tasksSubject.next([...this.tasks]);
      
      setTimeout(() => {
        resolve(newConcert);
      }, 1000);
    });
  }

  //READ
  getAllConcerts(): Observable<Concert[]> {
    return this.authService.currentUser.pipe(
      switchMap(async user => {
        if (!user) {
          return of([]);
        }
        try {
          const userData = this.getUser(user);

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
          const userData = this.getUser(user);

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
  
  //UTILS
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