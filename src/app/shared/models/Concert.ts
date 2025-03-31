import { Tour } from "./Tour";

export interface Concert{
    venue: string;
    place: string;
    time: Date;
    tour: Tour
}