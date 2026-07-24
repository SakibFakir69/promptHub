import { cloudinaryConfig } from '../../config/cloudniary/config.cloud';
import { NextFunction, Request, Response } from 'express';
import { Prompt, SavedPrompt } from './prompt.model';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { zodValidationPrompt } from './prompt.validation';
import { User } from '../users/user.model';
import { Types } from 'mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { notifyUser } from '../notification/notification.service';


// super test and deploy

// get

const getAllPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req?.user?.id;

    const result = await Prompt.find({ 'createdBy.userId': userId });

    return ReturnResponse(res, 200, true, 'prompt reterive', result);
  } catch (error) {
    next(error);
  }
};

// GET PROMPT DETAILS

const getPromptDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const promptId = req.params.id;

    if (!promptId) {
      return res.status(404).json({
        success: false,
        message: 'Please enter correct id',
      });
    }

    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: 'Please enter correct id',
      });
    }

    return ReturnResponse(
      res,
      200,
      true,
      'Prompt details fetch successfully',
      prompt,
    );
  } catch (error) {
    next(error);
  }
};

const promptImageUpload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    cloudinaryConfig.uploader
      .upload_stream(
        { resource_type: 'auto' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: 'Error uploading to Cloudinary' });
          }

          res.json({ public_id: result?.public_id, url: result?.secure_url });
        },
      )
      .end(req?.file.buffer);
  } catch (error) {
    next(error);
  }
};

//
// add zod validation

//

/* add attribute ( public , private) */
//

export const createPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('create - prompt');
    // Attach logged-in user info automatically
    if (!req.user) {
      return ReturnResponse(res, 401, false, 'Unauthorized: user not found');
    }
    const userId = req?.user.id;
    const user = await User.findById(userId);

    const promptData = {
      ...req.body,
      createdBy: {
        userId: user?.id,
        name: user?.name,
        avatar: user?.avatar,
      },
    };

    //  Validate with Zod
    const parsed = zodValidationPrompt.createPromptSchema.safeParse(promptData);
    if (!parsed.success) {
      return ReturnResponse(
        res,
        400,
        false,
        'Zod validation failed',
        parsed.error.format(),
      );
    }

    //  Create prompt in MongoDB
    const result = await Prompt.create(promptData);

    return ReturnResponse(
      res,
      201,
      true,
      'Prompt created successfully',
      result,
    );
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
    const updateZodValidation =
      await zodValidationPrompt.updatePromptSchema.safeParse(data);
    if (!updateZodValidation?.success) {
      return ReturnResponse(res, 400, false, 'update zod validation failed');
    }
    const { image, title, tags, prompt, visibility } = data;
    const payload = {
      title: title,
      prompt: prompt,
      tags: tags,
      image: image,
      visibility: visibility
    };

    const result = await Prompt.findOneAndUpdate(
      { 'createdBy.userId': userId },
      payload,
      {
        new: true,
        upsert: false,
      },
    );

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

    const deleted = await Prompt.findOneAndDelete({
      'createdBy.userId': userId,
    });

    if (!deleted) {
      return ReturnResponse(res, 404, false, 'Prompt not found');
    }

    return ReturnResponse(res, 200, true, 'Prompt deleted successfully');
  } catch (error) {
    next(error);
  }
};

// inc vote
// dec vote

type VoteResult = {
  upVote: number;
  downVote: number;
  userVote: 'up' | 'down' | null;
};

const upVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;
    if (!postId || !Types.ObjectId.isValid(postId)) {
      return ReturnResponse(res, 400, false, 'Invalid post id');
    }

    const userId = req.user?.id;
    if (!userId) {
      return ReturnResponse(res, 401, false, 'unauthorized');
    }

    const userObjectId = new Types.ObjectId(userId);

    // 1. Toggle off — atomic, only matches if user currently upvoted
    const removed = await Prompt.findOneAndUpdate(
      { _id: postId, upVotedBy: userObjectId },
      { $pull: { upVotedBy: userObjectId }, $inc: { upVote: -1 } },
      { new: true },
    );
    if (removed) {
      const data: VoteResult = { upVote: removed.upVote, downVote: removed.downVote, userVote: null };
      return ReturnResponse(res, 200, true, 'UpVote removed', data);
    }

    // 2. Switch down -> up — atomic, only matches if user currently downvoted
    const switched = await Prompt.findOneAndUpdate(
      { _id: postId, downVotedBy: userObjectId },
      {
        $pull: { downVotedBy: userObjectId },
        $addToSet: { upVotedBy: userObjectId },
        $inc: { downVote: -1, upVote: 1 },
      },
      { new: true },
    );
    if (switched) {
      const data: VoteResult = { upVote: switched.upVote, downVote: switched.downVote, userVote: 'up' };
      return ReturnResponse(res, 200, true, 'Switched to UpVote', data);
    }

    // 3. Fresh upvote — filter excludes users already in upVotedBy, so a
    // concurrent duplicate request simply matches nothing (no double count)
    const added = await Prompt.findOneAndUpdate(
      { _id: postId, upVotedBy: { $ne: userObjectId } },
      { $addToSet: { upVotedBy: userObjectId }, $inc: { upVote: 1 } },
      { new: true },
    );
    if (!added) {
      return ReturnResponse(res, 404, false, 'Post not found');
    }

    if (added.createdBy.userId.toString() !== userId) {
      await notifyUser(added.createdBy.userId.toString(), {
        title: '👍 New Upvote',
        body: `${added.createdBy.name} received a new upvote.`,
        data: { type: 'UPVOTE', promptId: added._id.toString(), senderId: userId },
      });
    }

    const data: VoteResult = { upVote: added.upVote, downVote: added.downVote, userVote: 'up' };
    return ReturnResponse(res, 200, true, 'UpVote added', data);
  } catch (error) {
    next(error);
  }
};

const downVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;
    if (!postId || !Types.ObjectId.isValid(postId)) {
      return ReturnResponse(res, 400, false, 'Invalid post id');
    }

    const userId = req.user?.id;
    if (!userId) {
      return ReturnResponse(res, 401, false, 'unauthorized');
    }

    const userObjectId = new Types.ObjectId(userId);

    // 1. Toggle off
    const removed = await Prompt.findOneAndUpdate(
      { _id: postId, downVotedBy: userObjectId },
      { $pull: { downVotedBy: userObjectId }, $inc: { downVote: -1 } },
      { new: true },
    );
    if (removed) {
      const data: VoteResult = { upVote: removed.upVote, downVote: removed.downVote, userVote: null };
      return ReturnResponse(res, 200, true, 'DownVote removed', data);
    }

    // 2. Switch up -> down
    const switched = await Prompt.findOneAndUpdate(
      { _id: postId, upVotedBy: userObjectId },
      {
        $pull: { upVotedBy: userObjectId },
        $addToSet: { downVotedBy: userObjectId },
        $inc: { upVote: -1, downVote: 1 },
      },
      { new: true },
    );
    if (switched) {
      const data: VoteResult = { upVote: switched.upVote, downVote: switched.downVote, userVote: 'down' };
      return ReturnResponse(res, 200, true, 'Switched to DownVote', data);
    }

    // 3. Fresh downvote — race-safe via filter
    const added = await Prompt.findOneAndUpdate(
      { _id: postId, downVotedBy: { $ne: userObjectId } },
      { $addToSet: { downVotedBy: userObjectId }, $inc: { downVote: 1 } },
      { new: true },
    );
    if (!added) {
      return ReturnResponse(res, 404, false, 'Post not found');
    }

    const data: VoteResult = { upVote: added.upVote, downVote: added.downVote, userVote: 'down' };
    return ReturnResponse(res, 200, true, 'DownVote added', data);
  } catch (error) {
    next(error);
  }
};


// MY SAVED PROMPT

// ADD INDEXING HERE
const mySavedPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?.id;

    // 1. check already saved
    const isAlreadySaved = await SavedPrompt.findOne({
      userId,
      promptId: prompt?._id,
    });

    if (isAlreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'This prompt is already saved',
      });
    }

    // 2. save
    const payload = {
      userId,
      promptId: prompt._id,
    };

    const result = await SavedPrompt.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Prompt saved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSavedPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user',
      });
    }

    const result = await SavedPrompt.find({ userId })
      .populate({
        path: 'promptId',

        select:
          'title prompt category tags upVote downVote visibility createdBy createdAt',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Saved prompts fetched successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// DELETE SAVED PROMPT




const deleteSavedPrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { promptId } = req.body;

    // 1. Auth Check
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found"
      });
    }


    if (!promptId) {
      return res.status(400).json({
        success: false,
        message: "Prompt ID is required in the request body"
      });
    }


    const result = await SavedPrompt.findOneAndDelete({
      promptId: promptId,
      userId: userId
    });


    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Saved prompt not found or you don't have permission to delete it"
      });
    }


    return res.status(200).json({
      success: true,
      message: "Prompt removed from your saved list successfully",

    });

  } catch (error) {
    next(error);
  }
};



const topTagsAndTopCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 10);

    const [tags, categories] = await Promise.all([
      Prompt.aggregate([
        { $match: { visibility: true, createdAt: { $gte: since } } },
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 }, totalUpvotes: { $sum: '$upVote' } } },
        { $addFields: { trendScore: { $multiply: ['$count', { $add: ['$totalUpvotes', 1] }] } } },
        { $sort: { trendScore: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, tag: '$_id', count: 1, trendScore: 1 } },
      ]),

      Prompt.aggregate([
        { $match: { visibility: true, createdAt: { $gte: since } } },
        { $unwind: '$category' },
        { $group: { _id: '$category', count: { $sum: 1 }, totalUpvotes: { $sum: '$upVote' } } },
        { $addFields: { trendScore: { $multiply: ['$count', { $add: ['$totalUpvotes', 1] }] } } },
        { $sort: { trendScore: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, category: '$_id', count: 1, trendScore: 1 } },
      ]),
    ]);

    // shuffle and slice 8–10
    const shuffle = <T>(arr: T[]) => arr.sort(() => Math.random() - 0.5);

    const randomCount = Math.floor(Math.random() * 3) + 8; // 8, 9, or 10

    res.json({
      success: true,
      data: {
        tags: shuffle(tags).slice(0, randomCount),
        categories: shuffle(categories).slice(0, randomCount),
      },
    });
  } catch (error) {
    next(error);
  }
};


export const promptController = {
  topTagsAndTopCategory,
  promptImageUpload,
  createPrompt,
  getPromptDetails,
  updatePrompt,
  deletePrompt,
  getAllPrompt,
  upVote,
  downVote,
  mySavedPrompt,
  getSavedPrompt,
  deleteSavedPrompt
};
