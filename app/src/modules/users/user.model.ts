import mongoose from 'mongoose';
import { IUser } from './user.interface';


const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    gender: { type: String, default: '' },
    totalPost: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    follower: { type: [String], default: [] },
    following: { type: [String], default: [] },
    isBlock:{type:Boolean , default:false},
    isDelete:{type:Boolean , default:false},
    isVerify:{type:Boolean,default:false}
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('user', userSchema);
