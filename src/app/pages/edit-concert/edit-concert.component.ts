import { Component, Input } from '@angular/core';
import { Concert } from '../../shared/models/Concert';
import { ConcertService } from '../../shared/services/concert.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TourService } from '../../shared/services/tour.service';
import { Tour } from '../../shared/models/Tour';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-concert',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    MatNativeDateModule
],
  templateUrl: './edit-concert.component.html',
  styleUrl: './edit-concert.component.scss'
})
export class EditConcertComponent {
  concert?: Concert | null;
  concertId?: string;
  concertForm!: FormGroup;
  tours: Tour[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private concertService: ConcertService,
    private tourService: TourService,
    private router: Router
  ){ }

  async ngOnInit(): Promise<void> {
    this.concert = await this.concertService.getConcertById(this.concertId!);
    this.initializeForm();

    const subscription = this.tourService.getAllTours()
    .subscribe({
      next: (tours) => {
          this.tours = tours;
          console.log('Tours loaded with observable');
        },
      error: (error) => {
        console.error('Error loading tours:', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  @Input()
  set id(id: string) {
    this.concertId = id;
  }

  //TODO: make it work with default values
  initializeForm(): void {
    this.concertForm = this.fb.group({
      // venue: [this.concert!.venue, [Validators.required, Validators.minLength(3)]],
      // place: [this.concert!.place, [Validators.required, Validators.minLength(3)]],
      // concertDate: [this.concert!.date, Validators.required]
      venue: ['', [Validators.required, Validators.minLength(3)]],
      place: ['', [Validators.required, Validators.minLength(3)]],
      concertDate: [new Date(), Validators.required]
    });
  }

  async editConcert(): Promise<void> {
    if (this.concertForm.valid) {
      const formValue = this.concertForm.value;
      
      const newConcert: Partial<Concert> = {
        venue: formValue.venue,
        place: formValue.place,
        date: formValue.concertDate,
        tour: this.concert!.tour
      };
      

      this.concertService.updateConcert(this.concertId!, newConcert)
      .then(() => {
        console.log("Update successful");
        this.router.navigate(["/tour"]);
      })
      .catch(error => {
        console.error('Error updating concert:', error);
      });
    } else {
      Object.keys(this.concertForm.controls).forEach(key => {
        const control = this.concertForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
