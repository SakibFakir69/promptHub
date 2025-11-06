/* eslint-disable @typescript-eslint/no-unused-vars */

import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// eslint-disable-next-line no-unused-vars
import express, { Application, NextFunction, Request, Response } from 'express';

import session, { SessionOptions as ExpressSessionOptions } from "express-session";

import "./config/passport/passport"


import { userRouter } from './modules/users/user.route';
import { AuthRouter } from './modules/auth/auth.route';
import { otpRouter } from './modules/otp/otp.route';
import { ErrorHandler } from './middleware/ErrorHandler';



// app
const app: Application = express();



// swagger ui
// Swagger Code
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation for Prompt Hub',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ],
    // tags
  },
  apis: ['./app/src/modules/**/*.ts']
}


const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// middleware 
// session middlweare


const sessionOptions:ExpressSessionOptions={
    secret: process.env.SESSION_SECRET || "defaultsecret", 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // secure: true requires HTTPS
}

app.use(session(sessionOptions))



// passport
app.use(passport.initialize())
app.use(passport.session());

// express ( middleware)
app.use(express.json()); /// convert to all json 
app.use(express.urlencoded({ extended: true })); // parse URL-encoded body
app.use(cookieParser()); //// enable cookies parser

// ejs
app.set("view engine","ejs")


// route 
app.use('/api/v1/user', userRouter);
// auth
app.use('/api/v1/auth', AuthRouter);
// otp
app.use('/api/v1/otp',otpRouter)

// api test
app.get('/', async (req: Request, res: Response) => {
  // sendEmail("sakibfakir749@gmail.com",'sakibfakir',1234);



  
  res.send('Hello, World!');
});



// handel error
app.use(ErrorHandler);

// Catch-all route for 404
app.use((req:Request, res:Response,next:NextFunction)=>{

  res.status(404).json({
    status:false,
    message:`Route not found: ${req.originalUrl}`
  
  })
})




export const myApp= app;