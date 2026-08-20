import { NextFunction, Request, Response } from "express";
import { redisClient } from "../redisClient";
import { ReturnResponse } from "app/src/helper/ReturnResponse";

export const getMyPromptFromCached =
  (keyBuilder: (req: Request) => string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const cacheKey = keyBuilder(req);

      if (!cacheKey) {
        throw new Error("Please provide redis key for getMyPrompt");
      }

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const promptData = JSON.parse(cached);
        return ReturnResponse(res, 200, true, "My prompts fetched successfully", promptData);
      }

      next();
    } catch (error) {
      next(error);
    }
  };





export const getTrendingFromCache =
  (keyBuilder: (req: Request) => string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = keyBuilder(req);

      if (!cacheKey) {
        throw new Error("Please provide redis key for trending");
      }

      const cached = await redisClient.get(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        return res.json({ success: true, data });
      }

      next();
    } catch (error) {
      next(error);
    }
  };