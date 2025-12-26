import { Router } from "express";
import { promptController, upload } from "./prompt.controller";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prompts
 *   description: Prompt image upload endpoint
 */

/**
 * @swagger
 * /prompts/create-prompt:
 *   post:
 *     tags: [Prompts]
 *     summary: Upload an image for a prompt
 *     description: Uploads a single image to Cloudinary and returns the public ID and URL.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 public_id:
 *                   type: string
 *                   example: "sample_public_id"
 *                 url:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Error uploading to Cloudinary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error uploading to Cloudinary"
 */
router.post('/create-prompt', upload.single("image"), promptController.promptImageUpload);
/**
 * @swagger
 * tags:
 *   name: Prompts
 *   description: API endpoints for managing prompts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Prompt:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "My AI Prompt"
 *         prompt:
 *           type: string
 *           example: "Generate a creative AI artwork"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["art","ai","creative"]
 *         profile:
 *           type: string
 *           example: "John Doe"
 *         image:
 *           type: string
 *           format: uri
 *           example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *         imagePublicId:
 *           type: string
 *           example: "sample_public_id"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Response:
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
 */

/**
 * @swagger
 * /prompts/create-prompt:
 *   post:
 *     tags: [Prompts]
 *     summary: Create a new prompt with image upload
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
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
 *                 example: ["art","ai","creative"]
 *               profile:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: Prompt created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Error uploading image to Cloudinary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error uploading image to Cloudinary"
 */


router.put('/update-prompt', promptController.updatePrompt)
/**
 * @swagger
 * /update-prompt:
 * put:
 * summary: Update an existing prompt
 * tags: [Prompts]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: string
 * description: The unique ID of the prompt to update
 * title:
 * type: string
 * prompt:
 * type: string
 * tags:
 * type: array
 * items:
 * type: string
 * image:
 * type: string
 * responses:
 * 200:
 * description: Prompt updated successfully
 * 401:
 * description: User unauthorized
 * 404:
 * description: Prompt not found
 * 500:
 * description: Internal server error
 */


router.delete('/delete-prompt', promptController.deletePrompt);
/**
 * @swagger
 * /delete-prompt/{id}:
 * delete:
 * summary: Delete a specific prompt
 * tags: [Prompts]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The unique ID of the prompt to delete
 * responses:
 * 200:
 * description: Prompt deleted successfully
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * message: { type: string, example: "Prompt deleted successfully" }
 * 401:
 * description: User authentication token missing
 * 404:
 * description: Prompt not found
 * 500:
 * description: Internal server error
 */



export const promptRouter = router;