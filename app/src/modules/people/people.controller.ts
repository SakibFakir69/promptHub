import { ReturnResponse } from './../../helper/ReturnResponse';
import { NextFunction, Request, Response } from "express";
import { User } from "../users/user.model";


interface Cursor {
  followers: number;
  _id: string;
}

const encodeCursor = (followers: number, _id: string): string =>
  Buffer.from(JSON.stringify({ followers, _id })).toString("base64");


const decodeCursor = (cursor: string): Cursor | null => {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
    if (typeof decoded.followers === "number" && typeof decoded._id === "string") {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
};

const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    const query: Record<string, any> = {};

    if (name || email) {
      const orConditions: Record<string, any>[] = [];
      if (name) orConditions.push({ name: { $regex: name, $options: "i" } });
      if (email) orConditions.push({ email: { $regex: email, $options: "i" } });
      query.$or = orConditions;
    }

    // age comes in as string from query params, parse it
    if (age !== undefined) {
      const parsedAge = Number(age);
      if (!isNaN(parsedAge)) {
        query.age = { $gte: parsedAge };
      }
    }

    if (gender) {
      query.gender = gender;
    }

    if (cursor) {
      const decoded = decodeCursor(cursor);
      if (!decoded) {
        return res.status(400).json({ message: "Invalid cursor" });
      }
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { followers: { $lt: decoded.followers } },
            { followers: decoded.followers, _id: { $gt: decoded._id } },
          ],
        },
      ];
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const result = await User.find(query)
      .sort({ followers: -1, _id: 1 })
      .limit(safeLimit + 1)
      .select("-password")
      .lean();

    const hasNextPage = result.length > safeLimit;
    const items = hasNextPage ? result.slice(0, safeLimit) : result;

    const nextCursor =
      hasNextPage && items.length > 0
        ? encodeCursor(
          (items[items.length - 1] as any).followers,
          String((items[items.length - 1] as any)._id)
        )
        : null;

    return res.status(200).json({
      data: items,
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

    // 1. Validations
    if (!targetUserId) {
      return ReturnResponse(res, 400, false, 'Target user ID is required');
    }

    if (!currentUserId) {
      return ReturnResponse(res, 401, false, "Token not valid");
    }


    if (currentUserId === targetUserId) {
      return ReturnResponse(res, 400, false, "You cannot follow yourself");
    }

    
    const currentUser = await User.findById(currentUserId).select('following');
    
    if (!currentUser) {
      return ReturnResponse(res, 404, false, "User not found");
    }

    const isFollowing = currentUser.following.includes(targetUserId);


    if (isFollowing) {
   
      await Promise.all([
   
        User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } }),
     
        User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
      ]);

      return ReturnResponse(res, 200, true, "Unfollowed successfully", { following: false });

    } else {
    
      await Promise.all([
      
        User.findByIdAndUpdate(targetUserId, { $push: { followers: currentUserId } }),
    
        User.findByIdAndUpdate(currentUserId, { $push: { following: targetUserId } }),
      ]);

      return ReturnResponse(res, 200, true, "Followed successfully", { following: true });
    }

  } catch (error) {
    next(error);
  }
};

export const peopleController = {
  searchUser,followUser
};