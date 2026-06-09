

import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import helmet from 'helmet';
import limiter from './middleware/rateLimiting';
import cors from 'cors'
import express, { Application, Request, Response } from 'express';

import session, { SessionOptions as ExpressSessionOptions } from "express-session";

import "./config/passport/passport"


import { userRouter } from './modules/users/user.route';
import { AuthRouter } from './modules/auth/auth.route';
import { otpRouter } from './modules/otp/otp.route';
import { ErrorHandler } from './helper/ErrorHandler';
import { promptRouter } from './modules/prompt/prompt.route';
import { feedRouter } from './modules/feed/feed.route';
import { discoverRouter } from './modules/discover/discover.route';
import { exploreRouter } from './modules/explore/explore.route';


// app
const app: Application = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], 
  exposedHeaders: ['Set-Cookie'],                               
  credentials: true,
}))

// swagger ui
// Swagger Code
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API documentation for Prompt Hub',
      version: '1.0.0',
      // contact
      
    },
    servers: [  
      {
        url: 'http://localhost:5000',
        description:"Local Server"
      }
      // online server
      
    ],

    
    // tags
  },
 apis: ['./app/src/modules/**/*.ts']



}


const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// helmet
app.use(helmet())
// limiter
app.use(limiter);

// middleware 
// session middlweare


const sessionOptions:ExpressSessionOptions={
    secret: process.env.SESSION_SECRET || "defaultsecret", 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // secure: true requires HTTPS
}

app.use(session(sessionOptions))




// middleware
app.use(passport.initialize())
app.use(passport.session());
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ejs
app.set("view engine","ejs")


app.use('/api/v1/auth', AuthRouter);       
app.use('/api/v1/user', userRouter);       
app.use('/api/v1/otp', otpRouter);
app.use('/api/v1/prompt', promptRouter);
app.use('/api/v1/discover', discoverRouter);
app.use('/api/v1/explore', exploreRouter);
app.use('/api/v1/feed', feedRouter);        // ← Made specific

// api test
app.get('/', async (req: Request, res: Response) => {
  // sendEmail("sakibfakir749@gmail.com",'sakibfakir',1234);



  
  res.send('Hello, World!');
});



// handel error
app.use(ErrorHandler);

// Catch-all route for 404
app.use((req:Request, res:Response)=>{

  res.status(404).json({
    status:false,
    message:`Route not found: ${req.originalUrl}`
  
  })
})




export const myApp= app;