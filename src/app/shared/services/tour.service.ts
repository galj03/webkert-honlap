import { Injectable } from '@angular/core';
import { Tour } from '../models/Tour';
import { collection, query, getDocs, Firestore } from '@angular/fire/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { TOUR_COLLECTION } from '../constants/constants';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TourService{
  private currentTour: Tour; //idk, assign this somehow

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private firestore: Firestore
  ) {
    var temp: Tour;
    this.getAllTours().forEach(t =>
    {
      temp = t[0];
    })
    .then(() => {
      this.currentTour = temp;
    });
  }

  //READ
  getAllTours(): Observable<Tour[]> {
      return this.authService.currentUser.pipe(
        switchMap(async user => {
          if (!user) {
            return of([]);
          }
          try {
            const tourCollection = collection(this.firestore, TOUR_COLLECTION);
            const tours: Tour[] = [];
  
            const q = query(tourCollection);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
              tours.push({ ...doc.data(), id: doc.id } as Tour);
            });
  
            return of(tours.sort((a, b) => {
              if(a.startYear == b.startYear){
                return a.endYear - b.endYear;
              }
              return a.startYear - b.startYear;
            }));
          } catch (error) {
            console.error('Error fetching concerts:', error);
            return of([]);
          }
        }),
        switchMap(concerts => concerts)
      );
    }

  getCurrentTour(): Tour {
    throw new Error('Method not implemented.');
  }

  //UPDATE
  updateCurrentTour(selectedTour: string) {
    throw new Error('Method not implemented.');
  }
}
