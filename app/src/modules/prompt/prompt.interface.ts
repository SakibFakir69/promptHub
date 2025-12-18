import { Types } from "mongoose";


export interface IPrompt {
  title: string;
  prompt: string;
  category: string[];
  tags: string[];
  upVote: number;
  downVote: number;

  createdBy: {
    userId: Types.ObjectId;
    name?: string;
    avatar?: string;
    
  };
}
