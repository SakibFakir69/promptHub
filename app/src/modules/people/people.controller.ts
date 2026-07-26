import mongoose from 'mongoose';
import { ReturnResponse } from './../../helper/ReturnResponse';
import { NextFunction, Request, Response } from "express";
import { User } from "../users/user.model";
import { notifyUser } from '../notification/notification.service';

interface Cursor {
  followersCount: number;
  _id: string;
}

const encodeCursor = (followersCount: number, _id: string): string =>
  Buffer.from(JSON.stringify({ followersCount, _id })).toString("base64");

const decodeCursor = (cursor: string): Cursor | null => {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
    if (typeof decoded.followersCount === "number" && typeof decoded._id === "string") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
};

const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = req.user?.id;

    const {
      name,
      email,
      age,
      gender,
      cursor,
      limit = "20",
    } = req.query as {
      name?: string;
      email?: string;
      age?: string;
      gender?: string;
      cursor?: string;
      limit?: string;
    };

    const matchStage: Record<string, any> = {
      isDelete: { $ne: true },
      isBlock: { $ne: true },
    };

    if (name || email) {
      const orConditions: Record<string, any>[] = [];
      if (name) orConditions.push({ name: { $regex: name, $options: "i" } });
      if (email) orConditions.push({ email: { $regex: email, $options: "i" } });
      matchStage.$or = orConditions;
    }

    if (age !== undefined) {
      const parsedAge = Number(age);
      if (!isNaN(parsedAge)) {
        matchStage.age = { $gte: parsedAge };
      }
    }

    if (gender) {
      matchStage.gender = gender;
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const pipeline: any[] = [
      { $match: matchStage },

      {
        $addFields: {
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          isFollowing: currentUserId
            ? {
                $in: [
                  new mongoose.Types.ObjectId(currentUserId), 
                  { $ifNull: ["$followers", []] },
                ],
              }
            : false,
        },
      },

      ...(cursor
        ? (() => {
            const decoded = decodeCursor(cursor);
            if (!decoded) return [];
            return [
              {
                $match: {
                  $or: [
                    { followersCount: { $lt: decoded.followersCount } },
                    {
                      followersCount: decoded.followersCount,
                      _id: { $gt: decoded._id },
                    },
                  ],
                },
              },
            ];
          })()
        : []),

      { $sort: { followersCount: -1, _id: 1 } },
      { $limit: safeLimit + 1 },

      {
        $project: {
          password: 0,
          followers: 0,
          following: 0,
        },
      },
    ];

    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (!decoded) {
        return res.status(400).json({ message: "Invalid cursor" });
      }
    }

    const result = await User.aggregate(pipeline);

    const hasNextPage = result.length > safeLimit;
    const items = hasNextPage ? result.slice(0, safeLimit) : result;

    const nextCursor =
      hasNextPage && items.length > 0
        ? encodeCursor(
            items[items.length - 1].followersCount,
            String(items[items.length - 1]._id)
          )
        : null;

    const data = items.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      gender: u.gender ?? "",
      age: u.age ?? null,
      avatar: u.avatar ?? null,
      photo: u.photo ?? null,
      bio: u.bio ?? "",
      followers: u.followersCount,
      isFollowing: u.isFollowing,
    }));

    return res.status(200).json({
      data,
      pagination: { nextCursor, hasNextPage },
    });
  } catch (error) {
    next(error);
  }
};


const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: targetUserId } = req.body;
    const currentUserId = req.user?.id;

    if (!targetUserId) {
      return ReturnResponse(res, 400, false, 'Target user ID is required');
    }

    if (!currentUserId) {
      return ReturnResponse(res, 401, false, 'Token not valid');
    }

    if (currentUserId === targetUserId) {
      return ReturnResponse(res, 400, false, 'You cannot follow yourself');
    }

    const currentUser = await User.findById(currentUserId).select('following');

    if (!currentUser) {
      return ReturnResponse(res, 404, false, 'User not found');
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } }),
        User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
      ]);

      return ReturnResponse(res, 200, true, 'Unfollowed successfully', { following: false });
    } else {
      await Promise.all([
        User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } }),
        User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } }),
      ]);

      await notifyUser(targetUserId, {
        title: '🎉 New Follower',
        body: `${req.user?.name} started following you.`,
        data: {
          type: 'FOLLOW',
          senderId: currentUserId,
        },
      });

      return ReturnResponse(res, 200, true, 'Followed successfully', { following: true });
    }
  } catch (error) {
    next(error);
  }
};



export const peopleController = {
  searchUser,
  followUser,
};