
import dotenv from 'dotenv'
dotenv.config();

import mongoose from "mongoose";

import { myApp } from ".";
import { Server } from 'http';
// import from server

const port: number = Number(process.env.PORT) || 5000;
const URI =process.env.DATABASE_URL;

let server:Server


// port
console.log(URI);

(async function(){

  if(!URI)
  {
    throw new Error('Not found Database Url');

  }

  try {

    await mongoose.connect(URI);

    server= myApp.listen(port, ()=>{

      console.log(`server running on this port ${port}`)
    })
    console.log(server);



    
  } catch (error) {
    console.log(error);
    
  }

})();

// add process on node js for better server handling