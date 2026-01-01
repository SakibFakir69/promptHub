import { Router } from 'express';
import { promptController } from './prompt.controller';
import { verifyToken } from '../../middleware/verifyToken';
import { upload } from '../../utils/multer';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prompts
 *   description: API endpoints for managing AI prompts (including image uploads)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Prompt:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8c123456789abcdef1234"
 *         title:
 *           type: string
 *           example: "My AI Prompt"
 *         prompt:
 *           type: string
 *           example: "Generate a cyberpunk city at night with neon lights"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["cyberpunk", "neon", "ai-art"]
 *         profile:
 *           type: string
 *           example: "John Doe"
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg"
 *         imagePublicId:
 *           type: string
 *           example: "sample_public_id"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     PromptResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Prompt created successfully"
 *         data:
 *           $ref: '#/components/schemas/Prompt'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * /create-prompt:
 *   post:
 *     tags: [Prompts]
 *     summary: Create a new prompt with optional image upload
 *     description: Accepts form data including an optional image file and prompt details. Image is uploaded to Cloudinary if provided.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - prompt
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to upload
 *               title:
 *                 type: string
 *                 example: "My AI Prompt"
 *               prompt:
 *                 type: string
 *                 example: "Generate a creative AI artwork"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["art", "ai", "creative"]
 *               profile:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: Prompt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromptResponse'
 *       400:
 *         description: Validation error or no required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error (e.g., Cloudinary upload failure)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/create-prompt',
  verifyToken,
  upload.single('image'),
  promptController.createPrompt, // Assuming you renamed or adjusted controller method
);

/**
 * @swagger
 * /update-prompt:
 *   put:
 *     tags: [Prompts]
 *     summary: Update an existing prompt
 *     description: Update prompt details. Image update is not supported in this endpoint (use separate upload if needed).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the prompt to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               prompt:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               profile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prompt updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromptResponse'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt not found
 *       500:
 *         description: Server error
 */
router.put('/update-prompt/:id', promptController.updatePrompt);

/**
 * @swagger
 * /delete-prompt:
 *   delete:
 *     tags: [Prompts]
 *     summary: Delete a specific prompt
 *     description: Permanently deletes a prompt by ID. Also deletes associated Cloudinary image if present.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the prompt to delete
 *     responses:
 *       200:
 *         description: Prompt deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Prompt deleted successfully"
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       404:
 *         description: Prompt not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-prompt/:id', promptController.deletePrompt);
/**
 * @swagger
 * /my-prompts:
 *   get:
 *     tags: [Prompts]
 *     summary: Get the current user's prompt
 *     description: Retrieves the prompt document associated with the authenticated user. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prompt retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "prompt retrieved"
 *                 data:
 *                   $ref: '#/components/schemas/Prompt'
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Prompt not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Prompt not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get('/get-prompt', verifyToken, promptController.getAllPrompt);
/**
 * @swagger
 * /upVote:
 *   post:
 *     tags: [Voting]
 *     summary: Upvote a prompt/post
 *     description: |
 *       Allows an authenticated user to upvote a prompt/post.
 *
 *       **Behavior:**
 *       - If the user has already upvoted → removes the upvote
 *       - If the user has downvoted → switches to upvote (removes downvote, adds upvote)
 *       - Otherwise → adds a new upvote
 *
 *       Returns the updated upvote and downvote counts in all cases.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: MongoDB ObjectId of the prompt/post to vote on
 *                 example: "64f8a123456789abcdef1234"
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Upvote operation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteResponse'
 *             examples:
 *               upvote-added:
 *                 summary: First time upvoting
 *                 value:
 *                   success: true
 *                   message: "UpVote added"
 *                   data:
 *                     upVote: 42
 *                     downVote: 5
 *               upvote-removed:
 *                 summary: Removing existing upvote
 *                 value:
 *                   success: true
 *                   message: "UpVote removed"
 *                   data:
 *                     upVote: 41
 *                     downVote: 5
 *               switched-from-downvote:
 *                 summary: Switching from downvote to upvote
 *                 value:
 *                   success: true
 *                   message: "Switched to UpVote"
 *                   data:
 *                     upVote: 42
 *                     downVote: 4
 *       400:
 *         description: Bad request - missing postId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "post id not found"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "unauthorized"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Post not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upVote', verifyToken, promptController.upVote);

/**
 * @swagger
 * /downVote:
 *   post:
 *     tags: [Voting]
 *     summary: Downvote a prompt/post
 *     description: |
 *       Allows an authenticated user to downvote a prompt/post.
 *
 *       **Behavior:**
 *       - If already downvoted → removes the downvote
 *       - If upvoted → switches to downvote
 *       - Otherwise → adds a new downvote
 *
 *       Returns updated vote counts.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: MongoDB ObjectId of the post
 *                 example: "64f8a123456789abcdef1234"
 *     responses:
 *       200:
 *         description: Downvote operation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteResponse'
 *             examples:
 *               downvote-added:
 *                 summary: New downvote
 *                 value: { success: true, message: "DownVote added", data: { upVote: 10, downVote: 6 } }
 *               downvote-removed:
 *                 summary: Downvote removed
 *                 value: { success: true, message: "DownVote removed", data: { upVote: 10, downVote: 5 } }
 *               switched-from-upvote:
 *                 summary: Switched from upvote
 *                 value: { success: true, message: "Switched to DownVote", data: { upVote: 9, downVote: 6 } }
 *       400:
 *         description: Missing postId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/downVote', verifyToken, promptController.downVote);

export const promptRouter = router;
