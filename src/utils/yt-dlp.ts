import { videoFormat, audioTrack } from "ytdl-core";

function hasAudio(format: videoFormat) {
  return format.audioQuality;
}

function hasVideo(format: videoFormat) {
  return format.height;
}

function doesStreamHasAudioAndVideo(format: videoFormat) {
  return hasAudio(format) && hasVideo(format);
}

export function getFormatsForStreamsWithAudiosAndVideo(
  formats: Array<videoFormat>
) {
  return formats.filter((format) => doesStreamHasAudioAndVideo(format));
}

export function parse(formats: Array<videoFormat>) {
  const list = {
    audio: [] as Array<videoFormat>,
    video: [] as Array<videoFormat>,
    both: [] as Array<videoFormat>,
  };

  formats.forEach((e) => {
    if (hasAudio(e) && hasVideo(e)) list.both.push(e);
    if (hasAudio(e) && !hasVideo(e)) list.audio.push(e);
    if (!hasAudio(e) && hasVideo(e)) list.video.push(e);
  });

  return list;
}
