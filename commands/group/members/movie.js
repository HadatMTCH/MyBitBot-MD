const axios = require("axios");
const baseurl = "https://pronoob-aio-drive.cf/Sct?search=";

module.exports.command = () => {
    let cmd = ["movie"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { evv } = msgInfoObj;
    const reply = (take) => {
        sock.sendMessage(
            from,
            {
                text: take,
                linkPreview: false
            },
            // { quoted: msg }
        );
    }
    if (!args[0]) return reply('Provide Movie Name.');

    let link = baseurl + evv.toLowerCase().split(" ").join("+");
    console.log(link);
    let url = `Direct link for ${evv}\n\n`;
    const res = await axios({
        method: "GET",
        url: link,
        responseType: "streamarraybuffer",
    }).catch(() => {
        return reply(`Site Down`)
    });
    try {

        data = res.data;
    } catch {
        return reply('Website Down');
    }
    let word = data.trim().replace(/^\s+|\s+$/gm, '').split("\n");
    try {
        for (let i = 0; i < word.length; i++) {
            if (word[i].startsWith("<a href")) {
                if (word[i].endsWith('mkv"') || (word[i].endsWith('mp4"')) || (word[i].endsWith('avi"')))
                    url += "🎬 https://pronoob-aio-drive.cf/" + word[i].substr(9, word[i].length - 10) + "\n\n";
            }
        }
        if (url != `Direct link for ${evv}\n\n`) {
            reply(url);
        } else {
            reply(`*Sorry* No Movie Found\nCheck your _spelling or try another movie_.`)
        }
    } catch (error) {
        reply('Error');
        console.log("error");
    }
}