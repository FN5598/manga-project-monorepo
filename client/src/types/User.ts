export enum UserType {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type User = {
  _id: string;
  email: string;
  createdAt: string;
  role: UserType;
  updatedAt: string;
  username: string;
};
