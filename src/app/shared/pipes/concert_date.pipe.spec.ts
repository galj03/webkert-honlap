import { ConcertDateFormatterPipe } from './concert_date.pipe';

describe('ConcertDateFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new ConcertDateFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
