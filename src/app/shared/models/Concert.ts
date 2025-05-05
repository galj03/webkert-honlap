import { Tour } from "./Tour";

export interface Concert{
    id: string,
    venue: string;
    place: string;
    date: Date; //TODO: string in firestore
    tour: string //Tour // number
}