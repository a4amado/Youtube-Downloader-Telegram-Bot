import ytdl, { videoFormat, audioTrack } from "ytdl-core";


function labelToNumber(label: string) {
  let num = "";
  for (let index = 0; index < label.length; index++) {
    if (Number.isInteger(Number(label[index]))) {
      num = num + label[index].toString();
    }
  }
  return Number(num);
}

const SortByIndex = (formats: Array<videoFormat & { i: number }>) => formats.sort((a, b) => (a.i > b.i ? -1 : 1))
const AddIndexToFormat = (formats: Array<videoFormat>) => formats.map((e) => ({ ...e, i: labelToNumber(e.qualityLabel) }))

export function parse(formats: Array<videoFormat>) {


  return {
    audioTracks: ytdl.filterFormats(formats, "audioonly")[0], // Always get the best audios trach possible
    videoTracks: SortByIndex(AddIndexToFormat(ytdl.filterFormats(formats, "video"))),
    clips: SortByIndex(AddIndexToFormat(ytdl.filterFormats(formats, "audioandvideo")))
  };
}
