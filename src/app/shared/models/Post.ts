import { User } from "./User";

export interface Post{
    title: string;
    content: string;
    postedBy: User;
    //TODO: something else?
}