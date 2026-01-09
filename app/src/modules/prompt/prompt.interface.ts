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
  visibility:boolean,
  // view count -> 


  createdBy: {
    userId: Types.ObjectId;
    name?: string;
    avatar?: string;
    
  };
    createdAt?: Date;
  updatedAt?: Date;
}
