import { User } from "./User";

export interface Post{
    id: string,
    title: string,
    content: string,
    postedBy: User,
    date: Date;
}

export interface FirebasePost{
    id: string,
    title: string,
    content: string,
    postedBy: string,
    date: string;
}