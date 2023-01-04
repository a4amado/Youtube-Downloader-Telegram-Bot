import env from "dotenv";
env.config();

import { Telegraf } from "telegraf";
import { Key, Keyboard } from "telegram-keyboard";

import ytdl from "ytdl-core";
import { getFormatsForStreamsWithAudiosAndVideo } from "./utils/yt-dlp";

const bot = new Telegraf(process.env.BOT_TOKEN || "");

bot.settings((e) => {
  e.reply(
    "⚙️Settings⚙️",
    Keyboard.inline([
      Key.callback("Change Default Quality", "change_quality"),
      Key.callback("❌", "❌"),
    ])
  );
});

const YTREGEXP = new RegExp("^(https?://)?((www.)?youtube.com|youtu.be)/.+$");
bot.hears(YTREGEXP, async (e) => {
  try {
    e.sendChatAction("typing");
 
    //   const info = await ytdl.getBasicInfo(e.message.text);

    //   const list = getItagForStreamsWithAudiosAndVideo(info.formats);

    e.reply(`
The Download Functionality is disabled
This Bot is for show only to see the code please visit:
https://github.com/a4addel/Youtube-Downloader-Telegram-Bot\n
`);
  } catch (error) {}
});

const not_YT_LINK = new RegExp("^((?!(http[s]?://)?(?:www.)?youtu.be|youtube.com).)*$");
bot.hears(not_YT_LINK, (e) => {
  e.reply("Please send Youtube link.")
})

bot.on("callback_query", (e) => {
  // @ts-ignore next-line
  switch (e.update.callback_query.data) {
    case "change_quality":
      e.reply(
        "Choose Default Quilty",
        Keyboard.inline([
          Key.callback("360p", "360"),
          Key.callback("720p", "720"),
          Key.callback("❌", "❌"),
        ])
      );
      e.answerCbQuery();

      break;
    case "❌":
      e.deleteMessage(e.message);
      e.answerCbQuery();
      break;
    case "720":
      e.reply("Code 720p");
      e.answerCbQuery();

      break;
    case "360":
      e.reply("Code 360p");
      e.answerCbQuery();
      break;
    default:
      break;
  }
});
bot.start((e) => {
  e.reply("Welcome");
  bot.telegram.setMyCommands([
    { command: "settings", description: "⚙️ Edit settings" },
  ]);
});

bot.launch();
