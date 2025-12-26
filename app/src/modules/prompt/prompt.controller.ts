import multer from 'multer';
import cloudinary from '../../config/cloudniary/config.cloud';
import { NextFunction, Request, Response } from 'express';

import { Prompt } from './prompt.model';
import { ReturnResponse } from '../../helper/ReturnResponse';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

//zod -> swagger > db desigin -> real test

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

//
// add zod validation
const createPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // title,image,tags,profile,prompt

    const promptData = req.body;
    const result = await Prompt.create(promptData);

    return ReturnResponse(res, 201, true, 'prompt create successfull', result);
  } catch (error) {
    next(error);
  }
};

// Edit prompt
// add validation
const updatePrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return ReturnResponse(res, 401, false, 'User unauthorize');
    }

    const data = req.body;
    const { image, title, tags, prompt } = data;
    const payload = {
      title: title,
      prompt: prompt,
      tags: tags,
      image: image,
    };

    const result = await Prompt.findByIdAndUpdate(userId, payload, {
      new: true,
      upsert: false,
    });

    if (!result) {
      return ReturnResponse(res, 404, false, 'Not find any data with this id');
    }
    // new return updated document

    return ReturnResponse(res, 200, true, 'prompt update successfully', result);
  } catch (error) {
    next(error);
  }
};

// delete prompt

  const deletePrompt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req?.user?.id;
      if (!userId) {
        return ReturnResponse(
          res,
          401,
          false,
          'User authentication token missing',
        );
      }

      const deleted = await Prompt.findOneAndDelete({ user: userId });

      if (!deleted) {
        return ReturnResponse(res, 404, false, 'Prompt not found');
      }

      return ReturnResponse(res, 200, true, 'Prompt deleted successfully');
    } catch (error) {
      next(error);
    }
  };

export const promptController = {
  promptImageUpload,
  createPrompt,
  updatePrompt,
  deletePrompt,
};
