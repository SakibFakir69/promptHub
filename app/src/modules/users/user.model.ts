
import mongoose from 'mongoose';
import { IUser } from './user.interface';


const userSchema = new mongoose.Schema<IUser>(
  {
   
    name: { type: String },
    email: { type: String, required: true, unique: true },

    password: {
    type: String,
    validate: {
      validator: function(this: IUser, value: string) {
        // return true if password is valid, false if invalid
        // We want password required only if googleId is not set
        return !!this.googleId || (!!value && value.length > 0);
      },
      message: 'Password is required if Google ID is not provided',
    },
  },

    
    googleId:{type:String},
    photo:{type:String},
    avatar:{type:String},

    bio: { type: String, default: '' },
    gender: { type: String, default: '' },
    totalPost: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    followers: { type: [String], default: [] },

    following: { type: [String], default: [] },
    isBlock:{type:Boolean , default:false},
    isDelete:{type:Boolean , default:false},
    isVerify:{type:Boolean,default:false},
    isLoggedIn:{type:Boolean, default:false}
  },
  { timestamps: true },
);

// Add virtual id field
// eslint-disable-next-line no-unused-vars
userSchema.virtual("id").get(function (this: IUser) {
  return this.id.toString();
});

export const User = mongoose.model<IUser>('user', userSchema);
