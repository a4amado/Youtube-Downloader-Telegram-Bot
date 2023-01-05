import env from "dotenv";
env.config();

import { randomUUID } from "crypto";
import { createWriteStream, writeFileSync } from "fs";
import path from "path";
import { extension } from "mime-types";
import { Telegraf } from "telegraf";
import { Key, Keyboard } from "telegram-keyboard";
import ytdl, { downloadFromInfo, videoFormat } from "ytdl-core";
const theWayTo = path.join(
  process.cwd(),
  "ffmpeg-n5.1-latest-win64-gpl-5.1/bin/ffmpeg.exe"
);

import app from "./firebase/init";
import { parse } from "./utils/yt-dlp";
import { exec } from "child_process";

const bot = new Telegraf(
  `${process.env.BOT_TOKEN_ID}:${process.env.BOT_TOKEN_SECRET}`
);

bot.settings((e) => {
  e.reply(
    "⚙️Settings⚙️",
    Keyboard.inline([
      Key.callback("Change Default Quality", "change_quality"),
      Key.callback("❌", "❌"),
    ])
  );
});

function getBestTrack(
  formats: Array<videoFormat>,
  quality: number
): videoFormat {
  let fallbackFormat: videoFormat = formats[0];

  loop: for (let index = 0; index < formats.length; index++) {
    // @ts-ignore

    // @ts-ignore
    if (formats[index]?.i <= quality) {
      fallbackFormat = formats[index];
      break loop;
    }
  }
  return fallbackFormat;
}

const YTREGEXP = new RegExp("^(https?://)?((www.)?youtube.com|youtu.be)/.+$");
bot.hears(YTREGEXP, async (e) => {
  try {
    e.sendChatAction("typing");
    e.reply("Working on it!");

    const qulaity = await app
      .firestore()
      .collection("USERS")
      .select("quality")
      .where("id", "==", e.from.id)
      .get();

    const quality = qulaity.docs[0].data()?.quality || 720;

    const info = await ytdl.getInfo(e.message.text);

    const parsedFormats = parse(info.formats);

    if (!parsedFormats) return;

    const vid = getBestTrack(parsedFormats.clips, quality) || getBestTrack(parsedFormats.videoTracks, quality);
    if (!vid) return;

    console.log(vid.hasAudio);
    

    const videoUUID = randomUUID();
    const audioUUID = randomUUID();

    const aPath = path.join(
      process.cwd(),
      audioUUID + ".ytd"
    );

    const vPath = path.join(
      process.cwd(),
      videoUUID + ".ytd"
    );
    const videoStream = createWriteStream(vPath);
    const audioStream = createWriteStream(aPath);

    if (vid.hasAudio) {
      e.reply("Downloading Video");
      ytdl(e.message.text, { filter: (format) => format.itag === vid.itag })
        .pipe(videoStream)
        .on("close", () => {
          e.sendChatAction("upload_video");
          e.replyWithVideo({
            source: vPath,
            filename: "s",
          });
        });
    } else {
      e.reply("Downloading Video");
      ytdl(e.message.text, { filter: (format) => format.itag === vid.itag })
        .pipe(videoStream)
        .on("close", () => {
          e.reply("Downloading Audio");
          ytdl(e.message.text, {
            filter: (format) => format.itag === parsedFormats.audioTracks.itag,
          })
            .pipe(audioStream)
            .on("close", () => {
              const mPath = path.join(process.cwd(), randomUUID() + ".ytd");
              e.reply("Merging");
              exec(
                `ffmpeg.exe -i ${aPath} -i ${vPath} -acodec copy -vcodec copy ${mPath}`
              ).on("close", () => {
                e.replyWithVideo({
                  source: mPath,
                }).then(() => {
                  exec(`rm -rf ${aPath} ${vPath} ${mPath}`);
                });
              });
            });
        });
    }

    // e.reply(
    //   "Wait"
    //   // "\nThe Download Functionality is disabled\nThis Bot is for show only to see the code please visit:\nhttps://github.com/a4addel/Youtube-Downloader-Telegram-Bot\n"
    // );
  } catch (error) {
    console.log(error);

    e.reply("error");
  }
});

const not_YT_LINK = new RegExp(
  "^((?!(http[s]?://)?(?:www.)?youtu.be|youtube.com).)*$"
);
// bot.hears(not_YT_LINK, (e) => {
//   e.reply("Please send Youtube link.");
// });

bot.on("callback_query", (e) => {
  // @ts-ignore next-line
  switch (e.update.callback_query.data) {
    case "change_quality":
      e.reply(
        "Choose Default Quilty",
        Keyboard.inline([
          Key.callback("360p", "360p"),
          Key.callback("720p", "720p"),
          Key.callback("1080p", "1080p60"),
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
      app
        .firestore()
        .collection("USERS")
        .doc(e.from?.id + "")
        .update({
          quality: 720,
        })
        .then(() => {
          e.answerCbQuery("Done");
        });

      break;
    case "360":
      app
        .firestore()
        .collection("USERS")
        .doc(e.from?.id + "")
        .update({
          quality: 360,
        })
        .then(() => {
          e.answerCbQuery("Done");
        });
      e.answerCbQuery();
      break;
    default:
      break;
  }
});
bot.start(async (e) => {
  const isUserAlreadyRegisterd = await app
    .firestore()
    .collection("USERS")
    .select("id,quality")
    .where("id", "==", e.message.from.id)
    .get();

  if (isUserAlreadyRegisterd.docs[0]) return e.reply("Welcome back");
  await app.firestore().collection("USERS").add({
    id: e.message.from.id,
    joind: new Date(),
    quality: 720,
  });

  e.reply("Welcome");
  bot.telegram.setMyCommands([
    { command: "settings", description: "⚙️ Edit settings" },
  ]);
});

bot.launch().then((e) => {
  console.log("UPP");
});
