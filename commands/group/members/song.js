const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
module.exports.command = () => {
    let cmd = ["song", "play"];
    return { cmd, handler };
}


const findSong = async (sname) => {
    const r = await yts(`${sname}`)
    return r.all[0].url;
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { evv } = msgInfoObj;
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }

    if (!args[0]) return reply(`❌ *Enter song name*`);

    let URL = await findSong(evv);

    (async () => {
        let title = (await ytdl.getInfo(URL)).videoDetails.title.split("|")[0];
        console.log("title :", title);
        let sany = `${title}.mp3`
        const stream = ytdl(URL, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
            .pipe(fs.createWriteStream(sany));
        console.log("Audio downloaded")
        await new Promise((resolve, reject) => {
            stream.on('error', reject)
            stream.on('finish', resolve)
        }).then(async (res) => {
            await sock.sendMessage(
                from,
                {
                    document: fs.readFileSync(sany),
                    mimetype: 'audio/mp4',
                    fileName: sany,
                    ppt: true,

                },
                {
                    quoted: msg,
                }
            ).then((resolved) => {
                console.log("Sent");
                try {
                    // fs.unlinkSync(sany)
                } catch { }
            }).catch((reject) => {
                reply(`_Enable to download send a valid req_`);
            })
        }).catch((err) => {
            console.log(err);
            reply(`_Unable to download,contact dev_.`);
        });
    })();
}