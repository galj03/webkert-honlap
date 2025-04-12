import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concertDateFormatter',
  standalone: true
})
export class ConcertDateFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${month}.${day}, ${year}`;
    } catch (error) {
      return value;
    }
  }
}