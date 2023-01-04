import path from "path";
import { exec } from "node:child_process";
const the_road_to_damascus = path.join(
  process.cwd(),
  "ffmpeg-n5.1-latest-win64-gpl-5.1/bin/ffmpeg.exe"
);

const merge = async ({ audio, video }: { audio: string; video: string }) => {};
