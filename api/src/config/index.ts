export * from './mail'
export * from './auth'
export * from './cache'


export const {
  NODE_ENV = "development",
  APP_PORT = 3000,
  APP_HOSTNAME = "localhost",
  // NOTE APP_SECRET is used to sign the session ID cookie,
  // the email verification URL, and the password reset token.
  // It may be prudent to use different secrets for each.

  SESSION_COOKIE = "sid",
} = process.env

export const IN_PROD = NODE_ENV === "production"
const IN_DEV = NODE_ENV === "development"
const IN_TEST = NODE_ENV === "test";

// Assert required variables are passed
[
  "APP_SECRET",
  IN_PROD && "APP_HOSTNAME",
  !IN_TEST && "MAIL_HOST",
  !IN_TEST && "MAIL_PORT",
  !IN_TEST && "MAIL_USERNAME",
  !IN_TEST && "MAIL_PASSWORD",
].forEach((secret) => {
  if (secret && !process.env[secret]) {
    throw new Error(`${secret} is missing from process.env`)
  }
})

const APP_PROTOCOL = IN_PROD ? "https" : "http"
const APP_HOST = `${APP_HOSTNAME}${IN_DEV ? `:${APP_PORT}` : ""}`
export const APP_ORIGIN = `${APP_PROTOCOL}://${APP_HOST}`