import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postDateFormatter',
  standalone: true
})
export class PostDateFormatterPipe implements PipeTransform {
  transform(date: Date): string {
    if (!date) return '';

    try {
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}.${month}.${day}.`;
    } catch (error) {
      return '';
    }
  }
}