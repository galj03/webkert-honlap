import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConcertComponent } from './edit-concert.component';

describe('EditConcertComponent', () => {
  let component: EditConcertComponent;
  let fixture: ComponentFixture<EditConcertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConcertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConcertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
