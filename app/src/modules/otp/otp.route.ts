import { Router } from 'express';
import { otpController } from './otp.controller';
import { verifyToken } from '../../middleware/verifyToken';

const router = Router();

/**
 * openapi
info:
  title: OTP Service API
  description: API for sending One-Time Password (OTP) via email.
  version: 1.0.0

paths:
  /send-otp:
    post:
      summary: Send OTP to user's email
      description: |
        Generates and sends a 4-digit OTP to the authenticated user's email.
        The OTP is stored in Redis with a 5-minute expiry.
        Rate-limited to prevent abuse (429 if requested too soon).
      tags:
        - Authentication
      security:
        - bearerAuth: []
      responses:
        '200':
          description: OTP sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "OTP sent successfully"
                  data:
                    type: object
                    properties:
                      email:
                        type: string
                        format: email
                        example: "user@example.com"
                      user_name:
                        type: string
                        example: "John Doe"
                      otp:
                        type: string
                        description: The generated OTP (included in response for testing/demo purposes)
                        example: "4821"
                      time:
                        type: integer
                        description: OTP validity in seconds
                        example: 300
                required:
                  - success
                  - message
                  - data

        '400':
          description: Bad Request - Missing email or username
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                message: "Email and username are required"

        '429':
          description: Too Many Requests - OTP already requested recently
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                success: false
                message: "Please wait before requesting another OTP."

        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained after login

  schemas:
    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
          example: "An error occurred"
      required:
        - success
        - message
 */

/**
 * paths:
  /verify-otp:
    post:
      summary: Verify OTP
      description: |
        Verifies the OTP sent to the user's email. The OTP must match the one stored in Redis
        and must not be expired (5-minute validity). On success, the OTP is deleted from Redis.
      tags:
        - Authentication
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                otp:
                  type: string
                  description: 4-digit OTP received via email
                  example: "4821"
                  pattern: '^\d{4}$'
              required:
                - otp
      responses:
        '200':
          description: OTP verified successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "OTP verified successfully."
                required:
                  - success
                  - message

        '400':
          description: Bad Request - Invalid or expired OTP, or validation failed
          content:
            application/json:
              schema:
                oneOf:
                  - $ref: '#/components/schemas/ValidationErrorResponse'
                  - $ref: '#/components/schemas/ErrorResponse'
              examples:
                validation_error:
                  summary: Zod validation failed
                  value:
                    success: false
                    message: "Validation Failed"
                    errors:
                      _errors: []
                expired_or_not_found:
                  summary: OTP not found or expired
                  value:
                    success: false
                    message: "OTP expired or not found."
                invalid_otp:
                  summary: OTP does not match
                  value:
                    status: false
                    message: "Invalid OTP."

        '500':
          description: Internal Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    ValidationErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
          example: "Validation Failed"
        errors:
          type: object
          description: Zod validation error details
          additionalProperties: true
      required:
        - success
        - message

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
          example: "An error occurred"
      required:
        - success
        - message

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token obtained after login
 */

router.post('/send-otp', verifyToken, otpController.sendOtp);

router.post('/verify-otp', verifyToken, otpController.verifyOtp);

export const otpRouter = router;
