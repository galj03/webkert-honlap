import { Injectable, OnInit } from '@angular/core';
import { Tour } from '../models/Tour';
import { collection, query, getDocs, Firestore, addDoc, updateDoc, where, limit } from '@angular/fire/firestore';
import { Observable, switchMap, of, firstValueFrom, take } from 'rxjs';
import { TOUR_COLLECTION } from '../constants/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TourService implements OnInit{
  private currentTour?: Tour;

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) { }

  async ngOnInit(): Promise<void> {
    await this.initCurrentTour();
  }

  async initCurrentTour(): Promise<Tour> {
    try{
    const tours = await firstValueFrom(this.getAllTours().pipe(take(1)));
      if(!tours.at(0)){
        console.error('No tour found.');
      }
      return tours.at(0) as Tour;
    }
    catch (error) {
      console.error('Error fetching tours.', error);
    }

    return null as unknown as Tour;
  }

  //CREATE
  async addTour(tour: Omit<Tour, 'id'>): Promise<Tour> {
    return new Promise(async (resolve) => {
        try {
          const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
          if (!user) {
            throw new Error('No authenticated user found');
          }
    
          const tourCollection = collection(this.firestore, TOUR_COLLECTION);
          
          const tourToSave = {
            ...tour
          };
          
          const docRef = await addDoc(tourCollection, tourToSave);
          const tourId = docRef.id;
          
          await updateDoc(docRef, { id: tourId });
          
          const newTour = {
            ...tourToSave,
            id: tourId
          } as Tour;
    
          resolve(newTour);
        } catch (error) {
          console.error('Error adding task:', error);
          throw error;
        }
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

  async getCurrentTour(): Promise<Tour> {
    return new Promise((resolve) => {
    if(!this.currentTour){
      this.initCurrentTour().then(t =>{
        this.currentTour = t;
        resolve(this.currentTour as Tour);
      });
    }

    resolve(this.currentTour as Tour);
    });
  }

  async getTourByTitle(title: string): Promise<Tour>{
    return new Promise(async (resolve, reject) => {
      try{
        const tourCollection = collection(this.firestore, TOUR_COLLECTION);
        const q = query(tourCollection,
                        where('title', '==', title),
                        limit(1)); // komplex query
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(doc => {
          console.log("asda");
          resolve({ ...doc.data(), id: doc.id } as Tour);
        });
      }
      catch (error) {
        console.error('Error fetching tours.', error);
      }
  console.log("asd");

      reject(null as unknown as Tour);
    });
  }

  //UPDATE

  //TODO
  //DELETE
}
