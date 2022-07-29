import { RequestHandler, ErrorRequestHandler } from "express"
import { PWD_CONFIRM_EXPIRES_IN_MS } from "./config";
import sql from "./db"
import { User } from "./db/user"

// https://expressjs.com/en/starter/faq.html#how-do-i-handle-404-responses

export const notFound: RequestHandler = (req, res, next) => {
  res.status(404).json({ message: "Not Found" });
};

export const serverError: ErrorRequestHandler = (err, req, res, next) => {
  // Handle "SyntaxError: Unexpected end of JSON input"
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: "Bad Request" });
  }

  console.error(err);
  res.status(500).json({ message: "Server Error" });
};

// Laravel's naming https://laravel.com/docs/8.x/middleware#assigning-middleware-to-routes

export const auth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
};

export const guest: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const verified: RequestHandler = async (req, res, next) => {
  const { userId } = req.session;
  const user = User.parse((await sql`SELECT * FROM users WHERE id=${Number(userId)}`)[0])

  if (!user.verified_at) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export const pwdConfirmed: RequestHandler = (req, res, next) => {
  const { confirmedAt } = req.session;

  if (!confirmedAt || confirmedAt + PWD_CONFIRM_EXPIRES_IN_MS <= Date.now()) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};
