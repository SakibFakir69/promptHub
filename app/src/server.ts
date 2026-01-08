import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

import { myApp } from '.';
import { Server } from 'http';

// import from server

const port: number = Number(process.env.PORT) || 5000;
const URI = process.env.DATABASE_URL;

export let server: Server;


(async function () {
  if (!URI) {
    throw new Error('Not found Database Url');
  }

  try {
    await mongoose.connect(URI);

    server = myApp.listen(port, () => {
      console.log(`server running on this port ${port}`);
    });
   
  } catch (error) {
    console.log(error);
  }
})();

// add process on node js for better server handling
// process access and manage system information



export const shutdown = (signal:any) => {
    
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdown("UNCAUGHT_EXCEPTION");
});
