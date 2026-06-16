import { Schema, model, Document, Types } from 'mongoose';


export type Platform = 'web' | 'expo';

export interface IDeviceToken extends Document {
  user: Types.ObjectId;
  token: string;
  platform: Platform;
  createdAt: Date;
  updatedAt: Date;
}

const deviceTokenSchema = new Schema<IDeviceToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ['web', 'expo'], required: true },
  },
  { timestamps: true }
);

export const DeviceToken = model<IDeviceToken>('DeviceToken', deviceTokenSchema);