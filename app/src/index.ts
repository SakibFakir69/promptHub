/* eslint-disable @typescript-eslint/no-unused-vars */

import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from 'passport';
// eslint-disable-next-line no-unused-vars
import express, { Application, NextFunction, Request, Response } from 'express';
import { userRouter } from './modules/users/user.route';
import { AuthRouter } from './modules/auth/auth.route';




const app: Application = express();

// middleware 


// passport
app.use(passport.initialize())

// express
app.use(express.json()); /// convert to all json 
app.use(express.urlencoded({ extended: true })); // parse URL-encoded body
app.use(cookieParser()); //// enable cookies parser

// api 

app.use('/api/v1', userRouter);
// auth
app.use('/api/v1/auth', AuthRouter);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});


// Catch-all route for 404


app.use((req:Request, res:Response,next:NextFunction)=>{

  res.status(404).json({
    status:false,
    message:`Route not found: ${req.originalUrl}`
  })
})




export const myApp= app;