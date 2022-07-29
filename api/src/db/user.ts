import { z } from "zod"

export const User = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
  username: z.string(),
  created_at: z.date(),
  verified_at: z.date().nullable()
})

export type User = z.infer<typeof User>;

export interface PasswordReset {
  id: number
  userId: number
  token: string
  expiresAt: string
}