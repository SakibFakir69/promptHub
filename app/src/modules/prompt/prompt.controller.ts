
import { cloudinaryConfig } from '../../config/cloudniary/config.cloud';
import { NextFunction, Request, Response } from 'express';
import { Prompt, SavedPrompt } from './prompt.model';
import { ReturnResponse } from '../../helper/ReturnResponse';
import { zodValidationPrompt } from './prompt.validation';
import { User } from '../users/user.model';
import { Types } from 'mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';



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


const getPromptDetails = async(req:Request , res:Response , next:NextFunction)=>{

  try {
    const promptId = req.params.id;

    if(!promptId)
    {
      return res.status(404).json({
        success:false,
        message:"Please enter correct id"

      })
    }

    const prompt = await Prompt.findById(promptId);
    if(!prompt){
       return res.status(404).json({
        success:false,
        message:"Please enter correct id"

      })
    }


    return ReturnResponse(res,200,true,'Prompt details fetch successfully',prompt);
  


    
  } catch (error) {
    next(error);
  }
}


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
      .upload_stream({ resource_type: 'auto' }, (error:UploadApiErrorResponse | undefined, result:UploadApiResponse | undefined) => {


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

// inc vote
// dec vote

const upVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return ReturnResponse(res, 400, false, "post id not found");
    }

    const userId = req.user?.id;
    if (!userId) {
      return ReturnResponse(res, 401, false, "unauthorized");
    }
    
    const userObjectId = new Types.ObjectId(userId);

    const post = await Prompt.findById(postId);
    if (!post) {
      return ReturnResponse(res, 404, false, "Post not found");
    }

    const alreadyUp = post.upVotedBy.includes(userObjectId);
    const alreadyDown = post.downVotedBy.includes(userObjectId);

    //  remove upvote
    if (alreadyUp) {
      const updated = await Prompt.findByIdAndUpdate(
        postId,
        {
          $pull: { upVotedBy: userId },
          $inc: { upVote: -1 }
        },
        { new: true }
      );

      return ReturnResponse(res, 200, true, "UpVote removed", {
        upVote: updated?.upVote,
        downVote: updated?.downVote
      });
    }

    //  switch down → up
    if (alreadyDown) {
      const updated = await Prompt.findByIdAndUpdate(
        postId,
        {
          $pull: { downVotedBy: userId },
          $addToSet: { upVotedBy: userId },
          $inc: { downVote: -1, upVote: 1 }
        },
        { new: true }
      );

      return ReturnResponse(res, 200, true, "Switched to UpVote", {
        upVote: updated?.upVote,
        downVote: updated?.downVote
      });
    }

    //  first upvote
    const updated = await Prompt.findByIdAndUpdate(
      postId,
      {
        $addToSet: { upVotedBy: userId },
        $inc: { upVote: 1 }
      },
      { new: true }
    );

    return ReturnResponse(res, 200, true, "UpVote added", {
      upVote: updated?.upVote,
      downVote: updated?.downVote
    });

  } catch (error) {
    next(error);
  }
};




const downVote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return ReturnResponse(res, 400, false, "post id not found");
    }

    const userId = req.user?.id;
    if (!userId) {
      return ReturnResponse(res, 401, false, "unauthorized");
    }
    
    const userObjectId = new Types.ObjectId(userId);

    const post = await Prompt.findById(postId);
    if (!post) {
      return ReturnResponse(res, 404, false, "Post not found");
    }

    const alreadyDown = post.downVotedBy.includes(userObjectId);
    const alreadyUp = post.upVotedBy.includes(userObjectId);

    // remove downvote
    if (alreadyDown) {
      const updated = await Prompt.findByIdAndUpdate(
        postId,
        {
          $pull: { downVotedBy: userId },
          $inc: { downVote: -1 }
        },
        { new: true }
      );

      return ReturnResponse(res, 200, true, "DownVote removed", {
        upVote: updated?.upVote,
        downVote: updated?.downVote
      });
    }

    //  switch up → down
    if (alreadyUp) {
      const updated = await Prompt.findByIdAndUpdate(
        postId,
        {
          $pull: { upVotedBy: userId },
          $addToSet: { downVotedBy: userId },
          $inc: { upVote: -1, downVote: 1 }
        },
        { new: true }
      );

      return ReturnResponse(res, 200, true, "Switched to DownVote", {
        upVote: updated?.upVote,
        downVote: updated?.downVote
      });
    }

    //  first downvote
    const updated = await Prompt.findByIdAndUpdate(
      postId,
      {
        $addToSet: { downVotedBy: userId },
        $inc: { downVote: 1 }
      },
      { new: true }
    );

    return ReturnResponse(res, 200, true, "DownVote added", {
      upVote: updated?.upVote,
      downVote: updated?.downVote
    });

  } catch (error) {
    next(error);
  }
};


// MY SAVED PROMPT 


// ADD INDEXING HERE
const mySavedPrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?.id;

    
    const isAlreadySaved = await SavedPrompt.findOne({
      userIdSavePrompt: userId,
      promptId: prompt?._id,
    });

    if (isAlreadySaved) {
      return res.status(400).json({
        success: false,
        message: "This prompt is already saved",
      });
    }

  
    const payload = {
      userIdSavePrompt: userId,
      promptId: prompt._id,
    };


    const result = await SavedPrompt.create(payload);

    return res.status(201).json({
      success: true,
      message: "Prompt saved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const getSavedPrompt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const result = await SavedPrompt.find({
      userIdSavePrompt: userId,
    })
      .populate({
        path: "promptId",
        model: "Prompt",
        select:
          "title prompt category tags upVote downVote visibility createdBy createdAt",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Saved prompts fetched successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};







export const promptController = {
  promptImageUpload,
  createPrompt,
  getPromptDetails
  ,
  updatePrompt,
  deletePrompt,
  getAllPrompt,
  upVote,downVote,
  mySavedPrompt,
  getSavedPrompt
};
