import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../users/user.model';

export const discoverPeople = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const name = req.query.name as string | undefined;
    const gender = req.query.gender as string | undefined;

    const query: any = {};

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { email: { $regex: name, $options: 'i' } },
      ];
    }

    if (gender && gender.trim() !== '') {
      query.gender = { $regex: `^${gender}$`, $options: 'i' };
    }

    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const userData = await User.find(query)
      .select(
        'name gender bio avatar totalPost followers following isVerify createdAt age',
      )
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    const nextCursor =
      userData.length === limit ? userData[userData.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      data: userData,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const discoverController = {
  discoverPeople,
};
