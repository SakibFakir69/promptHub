import * as z from 'zod'


const createPromptSchema = z.object({
  title: z.string().min(3).max(100),
  prompt: z.string().min(10),
  tags: z.array(z.string()).optional().default([]),
  image: z.string().url().optional()
 
});

const updatePromptSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  prompt: z.string().min(10).optional(),
  tags: z.array(z.string()).optional(),
  image: z.string().url().optional(),
});

export const zodValidationPrompt = {
    createPromptSchema, updatePromptSchema
}