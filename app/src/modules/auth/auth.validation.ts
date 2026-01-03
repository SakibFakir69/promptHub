import { z } from "zod";


const loginUserValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});


 const changePasswordSchema = z.object({
  password: z.string().min(8, { message: 'Old password must be at least 8 characters' }),
  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
});
 const resetPasswordSchema = z.object({

  newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
});



// export schema

export const authValidator = {
  loginUserValidationSchema,
changePasswordSchema , resetPasswordSchema
};
