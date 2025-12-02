
import {  Request, Response } from 'express';

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,

) => {
  return res.status(err.statusCode || 500).json({
    status: false,
    error: {
      name: `Error name is: ${err.message}`,
      message: `Error is :${err.message}`,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};
