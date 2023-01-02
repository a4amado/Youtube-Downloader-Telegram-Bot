import { Telegraf } from "telegraf"
const bot = new Telegraf("5871256589:AAERW5qBL0_I2-x6TOr46rPNDvtEHq_Thlo");


const YTREGEXP = new RegExp("^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$")

bot.hears(YTREGEXP,async(e) => {
    try {
    
    } catch (error) {
        
    }
})

bot.launch()