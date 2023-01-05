import { Telegraf } from "telegraf";

const bot = new Telegraf(
  `${process.env.BOT_TOKEN_ID}:${process.env.BOT_TOKEN_SECRET}`
);
export default bot;
