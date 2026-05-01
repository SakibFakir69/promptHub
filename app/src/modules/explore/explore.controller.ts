import { NextFunction, Request, Response } from 'express';
import { Prompt } from '../prompt/prompt.model';
import { ReturnResponse } from '../../helper/ReturnResponse';
import mongoose from 'mongoose';

const exploreAllPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cursor = req.query.cursor as string;
    const search = req.query.prompt as string; 
    const limit = 10;

    const query: any = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { prompt: searchRegex },
        { title: searchRegex },
        { tags: searchRegex }, 
      ];
    }

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    // 3. DATABASE FLOW
    const allPrompt = await Prompt.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const nextCursor =
      allPrompt.length === limit ? allPrompt[allPrompt.length - 1]._id : null;

    return ReturnResponse(res, 200, true, 'All Prompts fetched successfully', {
      data: allPrompt,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const exploreController = {
  exploreAllPrompt,
};
