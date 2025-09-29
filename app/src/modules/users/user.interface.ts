// create user
// verify , isdelete, activity  , isBlock

export interface IUser {
  name: string;
  email: string;
  password: string;
  bio: string;
  gender: string;
  totalPost: number;
  tags: string[];
  follower: string[];
  following: string[];
}
