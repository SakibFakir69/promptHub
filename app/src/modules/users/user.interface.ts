// create user
// verify , isdelete, activity  , isBlock

export interface IUser {
  _id:string,
 
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar:string,
  googleId:string,
  gender: string;
  totalPost: number;
  tags: string[];
  follower: string[];
  following: string[];
  isVerify:boolean,
  isBlock:boolean,
  isDelete:boolean,
  isLoggedIn:boolean,
  id:string, /// virtual id
  
}
