import { SessionOptions } from "express-session"
import { IN_PROD, SESSION_COOKIE } from "."

const ONE_HOUR_IN_MS = 1_000 * 60 * 60
const ONE_WEEK_IN_MS = 7 * 24 * ONE_HOUR_IN_MS

export const {
  APP_SECRET = "", // crypto.randomBytes(32).toString('base64')
} = process.env


export const SESSION_OPTS: SessionOptions = {
  cookie: {
    // domain, // current domain (Same-Origin, no CORS)
    httpOnly: true,
    maxAge: ONE_WEEK_IN_MS,
    sameSite: "strict",
    secure: IN_PROD,
  },
  name: SESSION_COOKIE,
  resave: false, // whether to save the session if it wasn't modified during the request
  rolling: true, // whether to (re-)set cookie on every response
  saveUninitialized: false, // whether to save empty sessions to the store
  secret: APP_SECRET,
}

// Bcrypt

export const BCRYPT_SALT_ROUNDS = 12

// Mail



// Passwords

export const PWD_RESET_TOKEN_BYTES = 40
export const PWD_RESET_EXPIRES_IN_HOURS = 12
export const PWD_CONFIRM_EXPIRES_IN_MS = 2 * ONE_HOUR_IN_MS