import { Tour } from "./Tour";

export interface Concert{
    id: number,
    venue: string;
    place: string;
    date: Date;
    tour: Tour
}