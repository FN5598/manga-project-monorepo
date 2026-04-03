import { z } from "zod";
import { nonEmptyString } from "./validator.utils.js";

const emailSchema = z.email();
const passwordSchema = z.string().trim().min(5).max(40);
const usernameSchema = z.string().trim().min(1).max(16);

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export const loginSchema = z.object({
  password: passwordSchema,
  email: emailSchema,
});

export const refreshAccessTokenSchema = z.object({
  userId: nonEmptyString,
});

export const logoutSchema = z.object({
  userId: nonEmptyString,
});
