import { Request, Response } from 'express';
import { Prompt } from '../prompt/prompt.model';
import { toPromptDTO } from '../prompt/prompt.dto';

export const feed = async (req: Request, res: Response) => {
  try {
    const { cursor, cursorId } = req.query;

    const query: any = { visibility: true };

    if (cursor && cursorId) {
      query.$or = [
        { createdAt: { $lt: new Date(cursor as string) } },
        {
          createdAt: new Date(cursor as string),
          _id: { $lt: cursorId },
        },
      ];
    }

    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(10)
      .select('-viewedBy -upVotedBy -downVotedBy')
      .lean();

    const last = prompts[prompts.length - 1];
    const nextCursor = last ? last.createdAt : null;
    const nextCursorId = last ? last._id : null;

    return res.json({
      success: true,
      data: prompts.map((p) => toPromptDTO(p, req.user?.id)),
      nextCursor,
      nextCursorId,
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