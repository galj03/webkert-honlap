import { User } from "./User";

export interface Post{
    id: number,
    title: string,
    content: string,
    postedBy: User,
    date: Date;
}