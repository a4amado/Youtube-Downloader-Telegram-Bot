import env from "dotenv";
env.config();
import { createWriteStream} from "fs";
import commands from "./utils/commands.json";
import { Key, Keyboard } from "telegram-keyboard";
import ytdl, { videoFormat } from "ytdl-core";
import { parse } from "./utils/yt-dlp";
import randomPATH from "./utils/randomPath";
import merge from "./utils/merge";
import clean from "./utils/clean";
import UpdateQulity from "./utils/updateQuality";
import getUser from "./utils/getUSer";
import addUser from "./utils/addUSer";
import bot from "./utils/createBot";

const YTREGEXP = new RegExp("^(https?://)?((www.)?youtube.com|youtu.be)/.+$");
const not_command = new RegExp("^(?!/).*");

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
  formats: Array<videoFormat & { i: number }>,
  quality: number
): videoFormat {
  let fallbackFormat: videoFormat = formats[0];
  loop: for (let index = 0; index < formats.length; index++) {
    if (formats[index]?.i <= quality) {
      fallbackFormat = formats[index];
      break loop;
    }
  }
  return fallbackFormat;
}


bot.hears(YTREGEXP, async (e) => {
  try {
    e.sendChatAction("typing");
    e.reply("Working on it!");
    const qulaity = await getUser(e.from.id.toString() || "");
    const quality = qulaity.docs[0].data()?.quality || 720;
    const info = await ytdl.getInfo(e.message.text);
    const parsedFormats = parse(info.formats);
    if (!parsedFormats) return;
    const vid =
      getBestTrack(parsedFormats.clips, quality) ||
      getBestTrack(parsedFormats.videoTracks, quality);
    if (!vid) return;

    const aPath = randomPATH({ ext: ".ytd" });
    const vPath = randomPATH({ ext: ".ytd" });

    const videoStream = createWriteStream(vPath);
    const audioStream = createWriteStream(aPath);

    if (vid.hasAudio) {
      e.reply("Downloading Video");
      const downloadVid = ytdl(e.message.text, { filter: (format) => format.itag === vid.itag })
      downloadVid.pipe(videoStream)
      downloadVid.on("close", async () => {
        await e.sendChatAction("upload_video");
        e.replyWithVideo({ source: vPath });
      });
    } else {
      e.reply("Downloading Video");
      const vi = ytdl(e.message.text, {
        filter: (format) => format.itag === vid.itag,
      });
      vi.pipe(videoStream);
      vi.on("close", () => {
        e.reply("Downloading Audio");
        const au = ytdl(e.message.text, {
          filter: (format) => format.itag === parsedFormats.audioTracks.itag,
        });

        au.pipe(audioStream);
        au.on("close", () => {
          const mPath = randomPATH({ ext: ".ytd" });
          e.reply("Merging");
          merge({ aPath, mPath, vPath }).on("close", async () => {
            await e.replyWithVideo({ source: mPath });
            clean([aPath, vPath, mPath]);
          });
        });
      });
    }

    // e.reply("\nThe Download Functionality is disabled\nThis Bot is for show only to see the code please visit:\nhttps://github.com/a4addel/Youtube-Downloader-Telegram-Bot\n");
  } catch (error) {
  
    e.reply("Something went wrong!");
  }
});

bot.hears([not_command], (e) => {
  e.reply("❌ Please send Valid YT Link ❌", {
    reply_to_message_id: e.message.message_id,
  });
});

const ChangeQualityKeyboard = Keyboard.inline([
  Key.callback("360p", "360p"),
  Key.callback("720p", "720p"),
  Key.callback("1080p", "1080p60"),
  Key.callback("❌", "❌"),
]);



bot.on("callback_query", async (e) => {
  try {
    // @ts-ignore next-line
    switch (e.update.callback_query.data) {
      case "change_quality":
        await e.reply("Choose Default Quilty", ChangeQualityKeyboard);
        e.answerCbQuery();
        break;
      case "❌":
        await e.deleteMessage(e.message);
        e.answerCbQuery();
        break;
      case "720":
        await UpdateQulity({
          quality: 720,
          user_id: (e.from?.id || "").toString(),
        });
        e.answerCbQuery();
        break;
      case "360":
        await UpdateQulity({
          quality: 360,
          user_id: (e.from?.id || "").toString(),
        });
        e.answerCbQuery();
        break;
      case "1080":
        await UpdateQulity({
          quality: 1080,
          user_id: (e.from?.id || "").toString(),
        });
        e.answerCbQuery();
        break;
      default:
        break;
    }
  } catch (error) {
    e.answerCbQuery("Something went wrong");
  }
});

bot.start(async (ctx) => {
  const isUserAlreadyRegisterd = await getUser(ctx.from.id.toString() || "");
  if (isUserAlreadyRegisterd.docs[0]) return ctx.reply("Welcome back");

  await addUser(ctx.from.id.toString() || "")
  await bot.telegram.setMyCommands(commands);
  await ctx.reply("Welcome");

});

bot.launch();
