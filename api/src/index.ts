import nodemailer from "nodemailer";
import { MAIL_OPTS, REDIS_OPTIONS } from "./config"
import { createApp } from "./app";
import connectRedis from "connect-redis"
import session from 'express-session'
import Redis from 'ioredis'
import { APP_PORT, APP_ORIGIN } from "./config";

const mailer = nodemailer.createTransport(MAIL_OPTS);

const client = new Redis(REDIS_OPTIONS)

const RedisStore = connectRedis(session)
const store = new RedisStore({ client })

const app = createApp(mailer, store);

app.listen(APP_PORT, () => console.log(APP_ORIGIN));
