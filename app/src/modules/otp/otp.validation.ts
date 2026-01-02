import { z } from 'zod';

export const zodOtpValidationSchema = z.object({
  otp: z
    .string()
    .length(4, { message: "OTP must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "OTP must contain only digits" })
    .refine((val:string) => /^\d{4}$/.test(val), {
      message: "Invalid OTP format",
    }),
});