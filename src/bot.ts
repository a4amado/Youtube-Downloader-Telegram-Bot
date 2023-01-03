import env from "dotenv";
import TK, { Key, Keyboard } from "telegram-keyboard";

env.config();

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN);
import ytdlp, { videoFormat } from "ytdl-core";

const YTREGEXP = new RegExp("^(https?://)?((www.)?youtube.com|youtu.be)/.+$");

bot.settings((e) => {
  e.reply(
    "⚙️Settings⚙️",
    TK.Keyboard.inline([
      Key.callback("Change Default Quality", "change_quality"),
    ])
  );
});

bot.on("callback_query", (e) => {
  // @ts-ignore next-line
  switch (e.update.callback_query.data) {
    case "change_quality":
      e.reply(
        "Choose Default Quilty",
        Keyboard.inline([
          Key.callback("360p", "360"),
          Key.callback("720p", "720"),
        ])
      );
      break;
    case "720":
      e.reply("Code 720p");
      break;
    case "360":
      e.reply("Code 360p");
      break;
    default:
      break;
  }
});

bot.command("settings", (e) => {
  e.reply("s");
});

function hasAudio(format: videoFormat) {
  return format.audioQuality;
}

function hasVideo(format: videoFormat) {
  return format.height;
}

function doesStreamHasAudioAndVideo(format: videoFormat) {
  return hasAudio(format) && hasVideo(format);
}

function getItagForStreamsWithAudiosAndVideo(formats: Array<videoFormat>) {
  return formats.filter((format) => doesStreamHasAudioAndVideo(format));
}

bot.hears(YTREGEXP, async (e) => {
  try {
    e.sendChatAction("typing");

    const info = await ytdlp.getBasicInfo(e.message.text);

    const list = getItagForStreamsWithAudiosAndVideo(info.formats);

    e.reply("ss");
  } catch (error) {}
});

bot.start((e) => {
  e.reply("Welcome", Keyboard.reply([Key.callback("/settings", "/settings")]));
});

bot.launch();
