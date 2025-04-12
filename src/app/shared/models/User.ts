export interface User {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
    password: string;
    //TODO: role
  }