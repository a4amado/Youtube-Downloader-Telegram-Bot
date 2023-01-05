const theRoadToFfmpeg = path.join(
  process.cwd(),
  "ffmpeg-n5.1-latest-win64-gpl-5.1/bin/ffmpeg.exe"
);
import { exec } from "child_process";
import path from "path";

export default function merge({
  aPath,
  vPath,
  mPath,
}: {
  aPath: string;
  vPath: string;
  mPath: string;
}) {
  return exec(
    `${theRoadToFfmpeg} -i ${aPath} -i ${vPath} -acodec copy -vcodec copy ${mPath}`
  );
}
