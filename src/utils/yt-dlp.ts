import ytdl, { videoFormat } from "ytdl-core";


const handleIfIsNumber = (char: any) =>   Number.isInteger(Number(char)) ? char : ""
const labelToNumber = (label: string)  => Number(label.split("").map(handleIfIsNumber).join(""));

const SortByIndex = (formats: Array<videoFormat & { i: number }>) => formats.sort((a, b) => (a.i > b.i ? -1 : 1))
const AddIndexToFormat = (formats: Array<videoFormat>) => formats.map((e) => ({ ...e, i: labelToNumber(e.qualityLabel) }))

export const parse = (formats: Array<videoFormat>) => ({
  audioTracks: ytdl.filterFormats(formats, "audioonly")[0], // Always get the best audios trach possible
  videoTracks: SortByIndex(AddIndexToFormat(ytdl.filterFormats(formats, "video"))),
  clips: SortByIndex(AddIndexToFormat(ytdl.filterFormats(formats, "audioandvideo")))
})
