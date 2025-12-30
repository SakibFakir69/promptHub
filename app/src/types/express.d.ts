// app/src/types/express.d.ts
import { IUser } from "../modules/users/user.interface";



declare global {
  namespace Express {
     
    interface User extends IUser {} // Extend Mongoose's IUser
    interface Request {
      user?: User; // Use the augmented Express.User
    }
  }
}