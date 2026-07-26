import { Types } from 'mongoose';

export interface PromptResponseDTO {
  _id: string;
  title: string;
  prompt: string;
  category: string[];
  tags: string[];
  image: string;
  upVote: number;
  downVote: number;
  userVote: 'up' | 'down' | null; // computed per-request, never persisted
  visibility: boolean;
  createdBy: { userId: string; name?: string; avatar?: string };
  createdAt?: Date;
  updatedAt?: Date;
}

// prompt: lean doc that still has upVotedBy/downVotedBy (needed to compute userVote)
// currentUserId: the requesting user, or undefined if logged out
export function toPromptDTO(prompt: any, currentUserId?: string): PromptResponseDTO {
  let userVote: 'up' | 'down' | null = null;

  if (currentUserId) {
    const isUp = prompt.upVotedBy?.some(
      (id: Types.ObjectId) => id.toString() === currentUserId
    );
    const isDown = prompt.downVotedBy?.some(
      (id: Types.ObjectId) => id.toString() === currentUserId
    );
    userVote = isUp ? 'up' : isDown ? 'down' : null;
  }

  return {
    _id: prompt._id.toString(),
    title: prompt.title,
    prompt: prompt.prompt,
    category: prompt.category,
    tags: prompt.tags,
    image: prompt.image,
    upVote: prompt.upVote,
    downVote: prompt.downVote,
    userVote,
    visibility: prompt.visibility,
    createdBy: {
      userId: prompt.createdBy?.userId?.toString(),
      name: prompt.createdBy?.name,
      avatar: prompt.createdBy?.avatar,
    },
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt,
  };
  // Note: upVotedBy / downVotedBy are intentionally NOT included —
  // exposing them leaks every voter's user ID to any client.
}