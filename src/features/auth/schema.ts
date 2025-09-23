import z from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password cannot be empty")
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is Required").trim(),
  email: z.email("Invalid email address").trim().min(1, "Email is Required"),
  password: z.string().min(8, "Password must be between 8 characters")
});
