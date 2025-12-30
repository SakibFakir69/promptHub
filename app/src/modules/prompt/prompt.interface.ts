import { Types } from "mongoose";


export interface IPrompt {
  title: string;
  prompt: string;
  category: string[];
  tags: string[];
  upVote: number;
  downVote: number;
   upVotedBy: Types.ObjectId[];
  downVotedBy: Types.ObjectId[];


  createdBy: {
    userId: Types.ObjectId;
    name?: string;
    avatar?: string;
    
  };
}
