export interface IUserPayload {
  id: string;
  email: string;
  name: string;
}

declare global {
  namespace Express {
   
    interface User extends IUserPayload {}

    interface Request {
      user?: IUserPayload;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};
