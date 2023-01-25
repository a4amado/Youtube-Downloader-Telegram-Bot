import ytdl, { videoFormat } from "ytdl-core";


const labelToNumber = (label: string) => {
  let num = "";
  for (let index = 0; index < label.length; index++) {
    if (Number.isInteger(label[index])) {
      num = num + label[index];
    } else {
      break;
    }
  }
  return Number(num);
}
  

const SortByHeight = (formats: Array<videoFormat>) =>
  // @ts-ignore
  formats.sort((a, b) => (a?.height > b?.height ? -1 : 1));

export const parse = (formats: Array<videoFormat>) => ({
  audioTracks: ytdl.filterFormats(formats, "audioonly")[0], // Always get the best audios trach possible
  videoTracks: SortByHeight(ytdl.filterFormats(formats, "video")),
  clips: SortByHeight(ytdl.filterFormats(formats, "audioandvideo")),
});
