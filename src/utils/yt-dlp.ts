import ytdl, { videoFormat, audioTrack } from "ytdl-core";

function hasAudio(format: videoFormat) {
  return format.audioQuality || format.bitrate;
}

function hasVideo(format: videoFormat) {
  return format.height;
}

function isVideo(e: videoFormat) {
  return !hasAudio(e) && hasVideo(e);
}

function isAudio(e: videoFormat) {
  return hasAudio(e) && !hasVideo(e);
}

function isTrack(e: videoFormat) {
  return hasAudio(e) && hasVideo(e);
}

function trimUnwantedQualities(
  f: Array<videoFormat>
): Array<videoFormat> | false {
  if (!f) return false;

  const maxItag = 399;

  const formats: Array<videoFormat> = [];
  for (let index = 0; index < f.length; index++) {
    if (f[index].itag <= maxItag) formats.push(f[index]);
  }

  const sortedFormats = formats.sort((e, b) => (e.itag > b.itag ? -1 : 1));
  if (sortedFormats.length === 0) return false;
  return sortedFormats;
}

function labelToNumber(label: string) {
  let num = "";
  for (let index = 0; index < label.length; index++) {
    if (Number.isInteger(Number(label[index]))) {
      num = num + label[index].toString();
    }
  }

  return Number(num);
}

export function parse(formats: Array<videoFormat>) {
  const wantedFormats = trimUnwantedQualities(formats);
  if (!wantedFormats) return false;

  return {
    audioTracks: ytdl.filterFormats(wantedFormats, "audioonly")[0],
    videoTracks: ytdl
      .filterFormats(wantedFormats, "video")
      .map((e) => ({ ...e, i: labelToNumber(e.qualityLabel) }))
      .sort((a, b) => (a.i > b.i ? -1 : 1)),
    clips: ytdl
      .filterFormats(wantedFormats, "audioandvideo")
      .map((e) => ({ ...e, i: labelToNumber(e.qualityLabel) }))
      .sort((a, b) => (a.i > b.i ? -1 : 1)),
  };
}
