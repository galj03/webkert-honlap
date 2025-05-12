import { User } from "./User";

export interface Post{
    id: string,
    title: string,
    content: string,
    postedBy: User, //User,//string
    date: Date; //TODO: string in firestore
}

export interface FirebasePost{
    id: string,
    title: string,
    content: string,
    postedBy: string,
    date: string;
}