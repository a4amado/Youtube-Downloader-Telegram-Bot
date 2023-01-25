import ytdl from "ytdl-core";

const url = "https://www.youtube.com/watch?v=DZ8zcV_vc3c";
ytdl.getInfo(url).then((e) => {
    console.log(e.formats.map(e => {
        if (e.hasVideo)  {
            return e.qualityLabel
        }
    }));
    
    
})
