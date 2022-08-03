import { z, ZodSchema } from "zod"
import { RequestHandler } from "express"
import { PWD_RESET_TOKEN_BYTES } from "./config/auth";

// TODO Use https://zod.dev/ for validation
export const validate = (schema: ZodSchema): RequestHandler => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    next()
  } catch (err) {
    return res.status(400).send(err)
  }
}


const email = z.string().email();

// NOTE instead of prehashing passwords with SHA256, we could limit
// them to 72 bytes (important: not characters) like so: .max(72, 'utf8')
// However, this would likely leak our password algorithm (i.e. bcrypt).
const password = z.string().max(256) // TODO password strength
const username = z.string().max(256) // TODO password strength

export const loginSchema = z.object({
  body: z.object({
    email,
    password,
  })
})

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
    username,
  })
})

// Based on Postgres `serial` type (4 bytes, roughly 2.1B)
// https://www.postgresql.org/docs/9.1/datatype-numeric.html
const id = z.number().positive().max(2 ** 31 - 1) // can't be zero or negative

export const verifyEmailSchema = z.object({
  query: z.object({
    id,
    expires: z.date(), // `raw` means it's not casted to a Date
    signature: z.string().length(64), // 256 / 8 * 2 (hex)
  }),
})

export const resendEmailSchema = z.object({
  body: z.object({ email })
})

export const sendResetSchema = z.object({
  body: z.object({ email })
})

export const resetPasswordSchema = z.object({
  query: z.object({
    id,
    token: z.string().length(PWD_RESET_TOKEN_BYTES * 2) // hex
  }),
  body: z.object({ password }),
})

export const confirmPasswordSchema = z.object({
  body: z.object({ password })
})
