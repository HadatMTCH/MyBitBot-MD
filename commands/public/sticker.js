const {
    downloadContentFromMessage,
} = require("@adiwajshing/baileys");


require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const fs = require('fs');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { setCountDM, getCountDM } = require("../../DB/countDMDB");
const { writeFile } = require('fs/promises');
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };

module.exports.command = () => {
    let cmd = ["sticker", "s"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const { prefix, sender, isMedia, isTaggedImage, isTaggedVideo, isGroup } = msgInfoObj;

    const reply = (tesk) => {
        sock.sendMessage(
            from,
            { text: tesk },
            // { quoted: msg }
        )
    }
    if (!isGroup) {
        await setCountDM(sender);
        if (getCountDM(sender) >= 100) {
            return reply('You have used your monthly limit.\nWait for next month.')
        }
        else {
            (async () => {
                const getDmCount = await getCountDM(sender);
                reply(`*Limit Left* : ${getDmCount}/100`);
            })();
        }
    }

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
        packName = "my"
    }
    if (authorName == "") {
        authorName = "BitBot"
    }
    if ((isMedia && !msg.message.videoMessage || isTaggedImage)) {
        let downloadFilePath;
        if (msg.message.imageMessage) {
            downloadFilePath = msg.message.imageMessage;
        } else {
            downloadFilePath = msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
        }
        const stream = await downloadContentFromMessage(downloadFilePath, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        const media = getRandom('.jpeg');
        await writeFile(media, buffer);
        (async () => {
            reply('⌛Changing media to sticker⏳');
            const sticker1 = new Sticker(media, {
                pack: packName,
                author: authorName,
                type: (args.includes('crop') || (args.includes("c"))) ? StickerTypes.CROPPED : args.includes("cc") ? StickerTypes.CIRCLE : StickerTypes.FULL,
                quality: 100,
            });
            const saveSticker = getRandom('.webp')
            await sticker1.toFile(saveSticker)
            await sock.sendMessage(
                from,
                {
                    sticker: fs.readFileSync(saveSticker)
                }
            );
            try {
                fs.unlinkSync(media);
                fs.unlinkSync(saveSticker)
            } catch {
                console.log("error");
            }
        })();
    } else if ((isMedia && msg.message.videoMessage.seconds < 11 || isTaggedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
        let downloadFilePath;
        if (msg.message.videoMessage) {
            downloadFilePath = msg.message.videoMessage;
        } else {
            downloadFilePath = msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
        }
        const stream = await downloadContentFromMessage(downloadFilePath, 'video');
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        const media = getRandom('.mp4');
        await writeFile(media, buffer);
        (async () => {
            reply('⌛Changing media file to Sticker⏳')
            const sticker1 = new Sticker(media, {
                pack: packName,
                author: authorName,
                type: (args.includes('crop') || (args.includes("c"))) ? StickerTypes.CROPPED : args.includes("cc") ? StickerTypes.CIRCLE : StickerTypes.FULL,
                quality: 40,
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
            } catch {
                console.log("error");
            }
        })();
    } else {
        reply(`❌ *Error reply to image or video only* `);
        console.log('Error not replyed');
    }
}