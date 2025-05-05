import { roles } from "../constants/constants";

export interface User {
    id: string;
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
    password: string;
    // role: roles;
  }