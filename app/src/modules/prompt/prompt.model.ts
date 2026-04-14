import mongoose, { Schema, Types, Document } from 'mongoose';
import { IPrompt } from './prompt.interface';

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

    upVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downVotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visibility: { type: Boolean, default: true },

    createdBy: {
      userId: {
        type: Types.ObjectId,
        ref: 'User', //// collection
        required: true,
      },

      name: String,
      avatar: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Prompt = mongoose.model('prompt', promptSchema);





// savedPrompt.model.ts


export interface ISavedPrompt extends Document {
  userId: Types.ObjectId;
  promptId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const savedPromptSchema = new Schema<ISavedPrompt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    promptId: {
      type: Schema.Types.ObjectId,
      ref: "Prompt", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


savedPromptSchema.index(
  { userId: 1, promptId: 1 },
  { unique: true }
);

export const SavedPrompt = mongoose.model<ISavedPrompt>(
  "SavedPrompt", 
  savedPromptSchema
);