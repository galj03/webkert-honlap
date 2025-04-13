import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Concert } from '../../shared/models/Concert';
import { ConcertService } from '../../shared/services/concert.service';
import { Tour } from '../../shared/models/Tour';
import { ConcertDateFormatterPipe } from '../../shared/pipes/concert_date.pipe';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tour',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConcertDateFormatterPipe,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.scss'
})
export class TourComponent implements OnInit{
  displayedColumns: string[] = ['venue', 'place', 'date', 'actions'];
  concertForm!: FormGroup;
  concerts: Concert[] = [];
  isLoading = false;

  //TODO: load these from service later
  selectedTour: string = "Test Tour";
  tourNames: string[] = ["Test Tour"];
  currentTour: Tour = {
      id: 1,
      title: "Test Tour",
      startYear: 2024,
      endYear: 2025
  }
  tours: Tour[] = [this.currentTour];
  title: string = this.currentTour.title;

  constructor(
    private fb: FormBuilder,
    private concertService: ConcertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadConcerts();
  }

  initializeForm(): void {
    this.concertForm = this.fb.group({
      venue: ['', [Validators.required, Validators.minLength(3)]],
      place: ['', [Validators.required, Validators.minLength(3)]],
      concertDate: [new Date(), Validators.required],
      tour: ['', Validators.maxLength(200)] //TODO: handle this
    });
  }

  loadConcerts(): void {
    this.concerts = this.concertService.getAllFromTour(this.currentTour);
    console.log("Concerts loaded.");
    // .subscribe(concerts => {
    //   this.concerts = concerts;
    //   console.log('Tasks loaded with observable');
    // });
  }

  refreshTour(): void{
    //TODO: connect with service (and firebase, later)
    // this.tourService.updateCurrentTour(this.selectedTour);
    // this.currentTour = this.tourService.getCurrentTour();
    console.log("Selected tour: ", this.selectedTour);
  }

  addConcert(): void {
    if (this.concertForm.valid) {
      this.isLoading = true;
      const formValue = this.concertForm.value;
      
      const newConcert: Omit<Concert, 'id'> = {
        venue: formValue.venue,
        place: formValue.place,
        date: formValue.concertDate,
        tour: this.currentTour
      };
      

      this.concertService.addConcert(newConcert)
        .then(addedConcert => {
          console.log('New concert added with promise', addedConcert);
          
          this.loadConcerts();
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      Object.keys(this.concertForm.controls).forEach(key => {
        const control = this.concertForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
