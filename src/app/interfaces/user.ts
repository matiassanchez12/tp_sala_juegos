export interface IUser {
  id: string;
  name: string;
  password: string;
  email?: string;
  timestamp: string;
}

export interface IUserScore {
  id: string;
  user: IUser;
  score: number;
  game: string;
  timestamp: string;
}
