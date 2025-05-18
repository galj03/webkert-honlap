import { roles } from "../constants/constants";

export interface User {
    id: string;
    authId: string;
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
    password: string;
    // role: roles;
  }