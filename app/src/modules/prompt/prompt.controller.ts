import multer from 'multer';
import cloudinary from '../../config/cloudniary/config.cloud';
import { NextFunction, Request, Response } from 'express';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

const promptImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // up vote , down , nutrual , description , photo
  try {
    console.log(req?.file);
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: 'Error uploading to Cloudinary' });
        }

        res.json({ public_id: result?.public_id, url: result?.secure_url });
      })
      .end(req?.file.buffer);
  } catch (error) {
    next(error);
  }
};

export const promptController = {
  promptImageUpload
};
