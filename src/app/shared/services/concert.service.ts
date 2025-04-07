import { Injectable } from '@angular/core';
import { Tour } from '../models/Tour';
import { Concert } from '../models/Concert';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {
  private currentTour: Tour = {
      id: 1,
      title: "Test Tour",
      startYear: 2024,
      endYear: 2025
  }
  private concerts: Concert[] = [
    {
      id: 1,
      venue: "Budapest Park",
      place: "Budapest, Hungary",
      date: new Date('2025-06-25'),
      tour: this.currentTour
    },
    {
      id: 2,
      venue: "Puskás Aréna",
      place: "Budapest, Hungary",
      date: new Date('2025-06-26'),
      tour: this.currentTour
    },
    {
      id: 3,
      venue: "Pick Aréna",
      place: "Szeged, Hungary",
      date: new Date('2025-07-05'),
      tour: this.currentTour
    },
  ]

  constructor() { }

  // private concertsSubject = new BehaviorSubject<Concert[]>(this.concerts);

  getAllFromTour(currentTour: Tour) {
    return this.concerts.filter(c => c.tour.id == currentTour.id);
  }

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
}
