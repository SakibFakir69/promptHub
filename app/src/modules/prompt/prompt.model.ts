import mongoose, { mongo, Schema, Types } from "mongoose";
import { IPrompt } from "./prompt.interface";

const promptSchema = new Schema<IPrompt>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    category: {
      type: [String],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    upVote: {
      type: Number,
      default: 0,
    },

    downVote: {
      type: Number,
      default: 0,
    },

      upVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
    createdBy: {
      userId: {
        type: Types.ObjectId,
        ref: "User",//// collection
        required: true,
      },
      
      name: String,
      avatar: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Prompt=mongoose.model("prompt",promptSchema);
