
require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const { YouTube } = require('social-downloader-sdk');

module.exports.command = () => {
    let cmd = ["yt", "ytv"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }
    const OwnerSend = (take) => {
        sock.sendMessage(
            myNumber,
            { text: take }
        )
    }

    if (!args[0]) return reply(`Enter youtube link after yt`);

    OwnerSend('YT: ' + args[0]);

    const resV = await YouTube.getVideo(args[0]);
    let YTtitle = resV.data.body.meta.title
    for (let i = 0; i < resV.data.body.url.length; i++) {
        if (
            resV.data.body.url[i].quality == 720
            && resV.data.body.url[i].no_audio == false
        ) {
            try {
                sock.sendMessage(
                    from,
                    {
                        video: { url: resV.data.body.url[i].url },
                        caption: `*Title*: ${YTtitle}
*Quality*: 720p`
                    },
                    {
                        quoted: msg
                    }
                )
            } catch {
                reply(`No 720p Found`)
            }
        } else if
            (
            resV.data.body.url[i].quality == 360
            && resV.data.body.url[i].no_audio == false
        ) {
            try {
                sock.sendMessage(
                    from,
                    {
                        video: { url: resV.data.body.url[i].url },
                        caption: `*Title*: ${YTtitle}
*Quality*: 360p`
                    },
                    {
                        quoted: msg
                    }
                )
            } catch {
                reply('No 360p Found')
            }
        }
    }
}