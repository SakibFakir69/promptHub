import { Router } from 'express';
import { promptController, upload } from './prompt.controller';
import { verifyToken } from '../../middleware/verifyToken';

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
 * /prompts/create-prompt:
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
  upload.single('image'),
  promptController.createPrompt, // Assuming you renamed or adjusted controller method
);

/**
 * @swagger
 * /prompts/update-prompt/{id}:
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
 * /prompts/delete-prompt/{id}:
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
 * /prompts/my-prompts:
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

router.get('/get-prompt', verifyToken ,promptController.getAllPrompt )

export const promptRouter = router;