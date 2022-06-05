const {
    downloadContentFromMessage,
} = require("@adiwajshing/baileys");

require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const fs = require('fs');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { writeFile } = require('fs/promises');
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };

module.exports.command = () => {
    let cmd = ["steal"];
    return { cmd, handler };
}


const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { evv, isTaggedSticker } = msgInfoObj;
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }
    if (!isTaggedSticker) return reply(`❌ *Reply on Sticker*`);

    try {
        var packName = ""
        var authorName = ""
        if (msg.message.extendedTextMessage) {
            if (!args);
            else {
                sock.sendMessage(
                    myNumber,
                    { text: `Args: ${args}` }
                )
            }
        }
        if (args.includes('pack') == true) {
            packNameDataCollection = false;
            for (let i = 0; i < args.length; i++) {
                if (args[i].includes('pack') == true) {
                    packNameDataCollection = true;
                }
                if (args[i].includes('author') == true) {
                    packNameDataCollection = false;
                }
                if (packNameDataCollection == true) {
                    packName = packName + args[i] + ' '
                }
            }
            if (packName.startsWith('pack ')) {
                packName = `${packName.split('pack ')[1]}`
            }
        }
        if (args.includes('author') == true) {
            authorNameDataCollection = false;
            for (let i = 0; i < args.length; i++) {
                if (args[i].includes('author') == true) {
                    authorNameDataCollection = true;
                }
                if (authorNameDataCollection == true) {
                    authorName = authorName + args[i] + ' '
                }
                if (authorName.startsWith('author ')) {
                    authorName = `${authorName.split('author ')[1]}`
                }
            }
        }
        if (packName == "") {
            packName = "myBitBot"
        }
        if (authorName == "") {
            authorName = "md"
        }
        if ((isTaggedSticker)) {
            let downloadFilePath;
            downloadFilePath = msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
            let isAnimated = downloadFilePath.isAnimated;
            const stream = await downloadContentFromMessage(downloadFilePath, 'sticker');
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            const media = getRandom('.webp');
            await writeFile(media, buffer);
            (async () => {
                if ((args.includes('author') == false || args.includes('pack') == false) && args.length != 0) {
                    const sticker1 = new Sticker(media, {
                        pack: evv,
                        type: StickerTypes.DEFAULT,
                        quality: isAnimated ? 50 : 100,
                    })
                    const saveSticker = getRandom('.webp')
                    await sticker1.toFile(saveSticker)
                    await sock.sendMessage(
                        from,
                        {
                            sticker: fs.readFileSync(saveSticker)
                        }
                    )
                    try {
                        fs.unlinkSync(media);
                        fs.unlinkSync(saveSticker)
                    } catch { }
                } else if ((args.includes('author') == true || args.includes('pack') == true) || args.length == 0) {
                    const sticker1 = new Sticker(media, {
                        pack: packName, // The pack name
                        author: authorName, // The author name
                        type: StickerTypes.DEFAULT,
                        quality: isAnimated ? 50 : 100,
                    })
                    const saveSticker = getRandom('.webp')
                    await sticker1.toFile(saveSticker)
                    await sock.sendMessage(
                        from,
                        {
                            sticker: fs.readFileSync(saveSticker)
                        }
                    )
                    try {
                        fs.unlinkSync(media);
                        fs.unlinkSync(saveSticker)
                    } catch { }
                }
            })();
        } else {
            reply(`*Reply To Sticker Only*`);
        }
    } catch (err) {
        console.log(err);
        reply("Error.")
    }
}