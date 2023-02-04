import ytdl, { videoFormat } from "ytdl-core";  

const SortByHeight = (formats: Array<videoFormat>) =>
  // @ts-ignore
  formats.sort((a, b) => (a?.height > b?.height ? -1 : 1));

export const parse = (formats: Array<videoFormat>) => ({
  audioTracks: ytdl.filterFormats(formats, "audioonly")[0], // Always get the best audios trach possible
  videoTracks: SortByHeight(ytdl.filterFormats(formats, "video")),
  clips: SortByHeight(ytdl.filterFormats(formats, "audioandvideo")),
});
