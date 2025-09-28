
import dotenv from 'dotenv'
dotenv.config();

import mongoose from "mongoose";

import { myApp } from ".";
// import from server

const port: number = Number(process.env.PORT) || 5000;
const URI =process.env.DATABASE_URL;

let server;


// port
console.log(URI);

(async function(){

  if(!URI)
  {
    throw new Error('Not founed Databse Url');

  }

  try {

    await mongoose.connect(URI);

    server= myApp.listen(port, ()=>{

      console.log(`server running on this port ${port}`)
    })



    
  } catch (error) {
    
  }

})();


myApp.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});