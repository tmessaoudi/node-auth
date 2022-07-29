import SMTPTransport from "nodemailer/lib/smtp-transport"
import { IN_PROD } from "."

export const {
  APP_HOSTNAME = "localhost",
  MAIL_HOST = "",
  MAIL_PORT = "",
  MAIL_USERNAME = "",
  MAIL_PASSWORD = "",
} = process.env


export const MAIL_OPTS: SMTPTransport.Options = {
  host: MAIL_HOST,
  port: +MAIL_PORT,
  secure: IN_PROD,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
}

export const MAIL_EXPIRES_IN_DAYS = 1
export const MAIL_FROM = `noreply@${APP_HOSTNAME}`