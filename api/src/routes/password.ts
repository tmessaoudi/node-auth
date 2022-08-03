import { Router } from "express"
import { randomBytes } from "crypto"
import dayjs from "dayjs"
import { SendMailOptions } from "nodemailer"
import { guest, auth } from "../middleware"
import {
  validate,
  sendResetSchema,
  resetPasswordSchema,
  confirmPasswordSchema,
} from "../validation"
import { hmacSha256, safeEqual, compress } from "../utils"
import { hashPassword, comparePassword } from "./auth"
import {
  APP_SECRET,
  PWD_RESET_TOKEN_BYTES,
  PWD_RESET_EXPIRES_IN_HOURS,
  APP_ORIGIN,
  MAIL_FROM,
} from "../config"
import sql from "../db"
import { User } from "../db/user"

const router = Router()

// Password reset request

router.post(
  "/password/email",
  guest,
  validate(sendResetSchema),
  async (req, res) => {
    const { email } = req.body

    const result = await sql`SELECT * FROM users WHERE email=${email}`
    if (!result.length) return res.status(400).json({ message: "Email does not exist" })

    const user = User.parse(result[0])

    const token = randomBytes(PWD_RESET_TOKEN_BYTES).toString("hex")
    const expiresAt = dayjs()
      .add(PWD_RESET_EXPIRES_IN_HOURS, "hour")
      .toISOString()

    // NOTE we treat reset tokens like passwords, so we don't store
    // them in plaintext. Instead, we hash and sign them with a secret.
    // db.passwordResets.push({
    //   id: db.passwordResets.length + 1,
    //   userId: user.id,
    //   token: hmacSha256(token, APP_SECRET),
    //   expiresAt,
    // });

    await sql`
      insert into password_resets (user_id, token, expires_at) 
      values (${Number(user.id)}, ${hmacSha256(token, APP_SECRET)}, ${expiresAt})
      returning id
    `

    const { mailer } = req.app.locals
    await mailer.sendMail(passwordResetEmail(email, token, user.id))

    res.json({ message: "OK" })
  }
)

// Password reset submission

router.post(
  "/password/reset",
  guest,
  validate(resetPasswordSchema),
  async (req, res) => {
    const { token, id } = req.query
    const { password } = req.body

    const hashedToken = hmacSha256(String(token), APP_SECRET)
    const resetToken = !!(await sql`SELECT * FROM password_resets WHERE user_id=${Number(id)} AND token=${hashedToken}`).length

    if (!resetToken) {
      return res.status(401).json({ message: "Token or ID is invalid" })
    }

    const result = await sql`SELECT * FROM users WHERE id=${Number(id)}`
    if (!result.length) throw new Error(`User id = ${id} not found`) // unreachable
    const user = User.parse(result[0])
    user.password = await hashPassword(password)

    // Invalidate all user reset tokens
    await sql`DELETE FROM password_resets WHERE user_id=${Number(id)}`

    res.json({ message: "OK" })
  }
)

// Password confirmation

router.post(
  "/password/confirm",
  auth,
  validate(confirmPasswordSchema),
  async (req, res) => {
    const { password } = req.body
    const { userId } = req.session

    const result = await sql`SELECT * FROM users WHERE id=${userId!}`
    if (!result.length) throw new Error(`User id = ${userId} not found`) // unreachable

    const user = User.parse(result[0])

    const pwdMatches = await comparePassword(password, user.password)

    if (!pwdMatches) {
      return res.status(401).json({ message: "Password is incorrect" })
    }

    req.session.confirmedAt = Date.now()

    res.json({ message: "OK" })
  }
)

// Utils

function passwordResetEmail(
  to: string,
  token: string,
  userId: number
): SendMailOptions {
  const url = `${APP_ORIGIN}/password/reset?id=${userId}&token=${token}`
  return {
    from: MAIL_FROM,
    to,
    subject: "Reset your password",
    html: compress(`
      <p>To reset your password, POST to the link below.</p>
      <a href="${url}">${url}</a>
    `), // TODO should be a link to the front-end
  }
}

export { router as password }
