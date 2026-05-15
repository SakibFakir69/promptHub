import { Request, Response } from 'express';
import { Prompt } from '../prompt/prompt.model';

export const feed = async (req: Request, res: Response) => {
  try {
    const { cursor } = req.query;

    const query: any = { visibility: true };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor as string) };
    }

    // Fetch prompts
    const prompts = await Prompt.find({}).limit(10).select('-viewedBy').lean();

    const nextCursor = prompts.length
      ? prompts[prompts.length - 1].createdAt
      : null;

    return res.json({
      success: true,
      data: prompts,
      nextCursor,
    });
  } catch (error) {
    console.error('Feed Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching feed',
    });
  }
};

export const feedController = {
  feed,
};
