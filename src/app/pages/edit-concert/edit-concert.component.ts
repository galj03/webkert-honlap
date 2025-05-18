import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Concert } from '../../shared/models/Concert';
import { ConcertService } from '../../shared/services/concert.service';
import { map, Observable, take } from 'rxjs';

@Component({
  selector: 'app-edit-concert',
  imports: [],
  templateUrl: './edit-concert.component.html',
  styleUrl: './edit-concert.component.scss'
})
export class EditConcertComponent {
  concert?: Concert | null;
  concertId?: string;

  constructor(
    private concertService: ConcertService
  ){ }

  async ngOnInit(): Promise<void> {
    this.concert = await this.concertService.getConcertById(this.concertId!);
  }

  @Input()
  set id(id: string) {
    this.concertId = id;
  }

}
