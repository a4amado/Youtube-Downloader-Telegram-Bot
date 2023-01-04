import { videoFormat } from "ytdl-core";

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
