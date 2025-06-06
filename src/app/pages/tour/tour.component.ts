import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { firstValueFrom, Subscription, take } from 'rxjs';
import { TourService } from '../../shared/services/tour.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

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
export class TourComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  displayedColumns: string[] = ['venue', 'place', 'date', 'actions', 'delete-action'];
  columnsWhenLoggedIn: string[] = ['venue', 'place', 'date', 'actions', 'delete-action'];
  columnsWhenNotLoggedIn: string[] = ['venue', 'place', 'date'];
  concertForm!: FormGroup;
  concerts: Concert[] = [];
  isLoading = false;

  private subscriptions: Subscription[] = [];

  selectedTour: string = '';
  tourNames: string[] = [];
  currentTour?: Tour;
  tours: Tour[] = [];
  title: string = '';

  constructor(
    private fb: FormBuilder,
    private concertService: ConcertService,
    private tourService: TourService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeForm();
    await this.loadTourData();
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
          this.userService.getUser(user)
          .then(u => {
            this.isLoggedIn = u !== null;
            this.displayedColumns = this.isLoggedIn ? this.columnsWhenLoggedIn : this.columnsWhenNotLoggedIn;
          })
          .catch(error => {
            console.error('Error fetching user:', error);
            this.displayedColumns = this.columnsWhenNotLoggedIn;
          });
  }

  async loadTourData() {
    this.currentTour = await this.tourService.getCurrentTour();
    this.title = this.currentTour.title;
    console.log("Selected tour: ", this.currentTour);

    this.loadConcerts();

    const subscription = this.tourService.getAllTours()
    .subscribe({
      next: (tours) => {
          this.tours = tours;
          this.tourNames = tours.map(t => t.title);
          console.log('Tours loaded with observable');
        },
      error: (error) => {
        console.error('Error loading tours:', error);
        this.isLoading = false;
        // this.showNotification('Error loading tours', 'error');
      }
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  initializeForm(): void {
    this.concertForm = this.fb.group({
      venue: ['', [Validators.required, Validators.minLength(3)]],
      place: ['', [Validators.required, Validators.minLength(3)]],
      concertDate: [new Date(), Validators.required],
      tour: ['', Validators.maxLength(200)]
    });
  }

  loadConcerts(): void {
    const subscription = this.concertService.getAllConcertsFromTour(this.currentTour!)
    .subscribe({
      next: (concerts) => {
          this.concerts = concerts;
          console.log('Concerts loaded with observable');
        },
      error: (error) => {
        console.error('Error loading concerts:', error);
        this.isLoading = false;
        // this.showNotification('Error loading concerts', 'error');
      }
    });

    this.subscriptions.push(subscription);
  }

  async refreshTour() {
        this.currentTour = await this.tourService.getTourByTitle(this.selectedTour);
        this.title = this.currentTour.title;
        this.loadConcerts();
  }

  addConcert(): void {
    if (this.concertForm.valid) {
      this.isLoading = true;
      const formValue = this.concertForm.value;
      
      const newConcert: Omit<Concert, 'id'> = {
        venue: formValue.venue,
        place: formValue.place,
        date: formValue.concertDate,
        tour: this.currentTour!.id
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

  
  editConcert(concert: any) {
    const concertObj = concert as Concert;
     this.router.navigate(['/edit-concert', concertObj.id]);
  }

  deleteConcert(concert: any) {
    const concertObj = concert as Concert;
    this.concertService.deleteConcert(concertObj.id)
    .then(()=>{
      this.loadConcerts();
    });
  }
}
