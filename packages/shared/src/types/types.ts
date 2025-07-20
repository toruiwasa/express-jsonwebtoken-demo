import { z } from "zod/v4";

export const SignupInputSchema = z.object({
  email: z.email("Invalid email format").max(254, "Email too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password too long")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]).+$/,
      "Must include uppercase, lowercase, number, and special character."
    ),
});

export const LoginInputSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
