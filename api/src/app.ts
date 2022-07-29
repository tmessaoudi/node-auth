import "express-async-errors";
import { Transporter } from "nodemailer";
import express from "express";
import helmet from "helmet";
import session, { Store } from "express-session"
import { errors } from "celebrate";
import { SESSION_OPTS } from "./config";
import { demo, auth, email, password } from "./routes";
import { notFound, serverError } from "./middleware";

// If no RedisStore then use MemoryStore
export const createApp = (mailer: Transporter, store?: Store) => { 
  const app = express();

  app.locals.mailer = mailer;

  app.use(helmet());

  app.use(session({ ...SESSION_OPTS, store }));

  app.use(express.json());

  app.use(
    demo, // sample routes to test middleware
    auth, // login, logout, register
    email, // email verification, resend
    password // password recovery and confirmation
  );

  app.use(notFound);

  app.use(errors());

  app.use(serverError);

  return app;
};
