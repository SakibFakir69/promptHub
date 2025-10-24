// app/src/types/express.d.ts
import { IUser } from "../modules/users/user.interface";

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUser {} // Extend Mongoose's IUser
    interface Request {
      user?: User; // Use the augmented Express.User
    }
  }
}