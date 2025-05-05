import { User } from "./User";

export interface Post{
    id: string,
    title: string,
    content: string,
    postedBy: string, //User,//string
    date: Date; //TODO: string in firestore
}