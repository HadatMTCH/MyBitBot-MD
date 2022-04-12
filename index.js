const axios = require('axios')
const { writeFile } = require('fs/promises')
const fs = require('fs')
const memeMaker = require('@erickwendel/meme-maker')
const ffmpeg = require('fluent-ffmpeg')//sticker module
const { Sticker } = require('wa-sticker-formatter')
const { userHelp } = require('./plugins/help')
/* --------------------------------- SERVER --------------------------------- */
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("Bot is running.. :)");
});
app.listen(port, () => {
    console.log("\nWeb-server running!\n");
});
const {
    default: makeWASocket,
    DisconnectReason,
    AnyMessageContent,
    delay,
    useSingleFileAuthState,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    downloadContentFromMessage,
    MessageType,
    MessageOptions,
    Mimetype
} = require("@adiwajshing/baileys");
const P = require("pino");
let MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const store = makeInMemoryStore({ logger });


store.readFromFile("./baileys_store_multi.json");
// save every 10s
setInterval(() => {
    store.writeToFile("./baileys_store_multi.json");
}, 10_000);

// const { getAuthMD, setAuthMD } = require("./DB/authMD");
// let state = getAuthMD();

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");
const getGroupAdmins = (participants) => {
    admins = [];
    for (let i of participants) {
        i.isAdmin ? admins.push(i.jid) : "";
    }
    return admins;
};
// start a connection
const startSock = async () => {
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
    let noLogs = P({ level: "silent" }); //to hide the chat logs
    const sock = makeWASocket({
        version,
        logger: noLogs,
        printQRInTerminal: true,
        auth: state,
    });
    store.bind(sock.ev);
    const sendMessageWTyping = async (msg, jid) => {
        await sock.presenceSubscribe(jid);
        await delay(500);
        await sock.sendPresenceUpdate("composing", jid);
        await delay(2000);
        await sock.sendPresenceUpdate("paused", jid);
        await sock.sendMessage(jid, msg);
    };
    //-------------------------OWNER-SEND------------------------------------//
    const OwnerSend = (teks) => {
        sock.sendMessage(
            OwnerNumb,
            { text: teks }
        )
    }
    //-----------------------------------------------------------------------//

    //---------------------------------------------------------------------------------------------------------//
    //---------------------------------------group-participants.update-----------------------------------------//
    sock.ev.on('group-participants.update', (anu) => {
        try {
            sock.groupMetadata(anu.jid).then((res) => {
                OwnerSend(`*Action:* ${anu.action} \n*Group:* ${anu.id} \n*Grp Name:* ${res.subject} \n*Participants:* ${anu.participants[0]}`);
            })
            console.log(anu);
            // if (anu.action == 'add') {
            //     OwnerSend(`*Group:* ${anu.jid} \n*Grp Name:* ${mdata.subject} \n*Participants:* ${anu.participants[0]}`);
            // }
            // if (anu.action == 'remove') {
            //     OwnerSend(`*Group:* ${anu.jid} \n*Grp Name:* ${mdata.subject} \n*Participants:* ${anu.participants[0]}`);
            // }
        } catch (e) {
            console.log(e)
        }
    });
    //-------------------------------------------------------------------------------------------------------------------//
    //***************************************SETTINGS*************//
    const OwnerNumb = '918318585418@s.whatsapp.net';
    const prefix = '.';
    const allowedNumbs = ["918318585418"];
    const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` }
    //***********************************************************//

    //************************************************************/
    const { downloadmeme } = require('./plugins/meme')
    //************************************************************/

    //************************************************************/
    //Hroroscope function
    async function gethoro(sunsign) {
        var mainconfig = {
            method: 'POST',
            url: `https://aztro.sameerkumar.website/?sign=${sunsign}&day=today`
        }
        let horo
        await axios.request(mainconfig).then((res) => {
            horo = res.data
        }).catch((error) => {
            return false;
        })
        return horo;
    }
    //************************************************************/
    //---------------------------------------messages.upsert----------------------------------//
    sock.ev.on("messages.upsert", async (mek) => {
        const msg = JSON.parse(JSON.stringify(mek)).messages[0];
        // if (!msg.key.fromMe)
        //     console.log('msg ', msg.message);
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        // console.log('Mek: ',mek.messages);
        const content = JSON.stringify(msg.message);
        const from = msg.key.remoteJid;
        // const type=''
        const type = Object.keys(msg.message)[0];


        //-------------------------------BOT-NUMBER------------------------------//
        let botNumberJid = sock.user.id;
        botNumberJid =
            botNumberJid.slice(0, botNumberJid.search(":")) +
            botNumberJid.slice(botNumberJid.search("@"));


        //----------------------------BODY take message part---------------------------------------//
        let body = type === "conversation" &&
            msg.message.conversation.startsWith(prefix)
            ? msg.message.conversation
            : type == "imageMessage" &&
                msg.message.imageMessage.caption &&
                msg.message.imageMessage.caption.startsWith(prefix)
                ? msg.message.imageMessage.caption
                : type == "videoMessage" &&
                    msg.message.videoMessage.caption &&
                    msg.message.videoMessage.caption.startsWith(prefix)
                    ? msg.message.videoMessage.caption
                    : type == "extendedTextMessage" &&
                        msg.message.extendedTextMessage.text &&
                        msg.message.extendedTextMessage.text.startsWith(prefix)
                        ? msg.message.extendedTextMessage.text
                        : "";
        //----------------------------------------------------------------------------------------//
        if (body[1] == " ") body = body[0] + body.slice(2);
        const evv = body.trim().split(/ +/).slice(1).join(' ');
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(prefix);
        const isGroup = from.endsWith("@g.us");
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
        let sender = isGroup ? msg.key.participant : mek.messages[0].key.remoteJid;
        const senderNumb = sender.includes(":") ? sender.split(":")[0] : sender.split("@")[0];
        if (msg.key.fromMe) sender = botNumberJid;
        //-----------------------------------------------------------------------//
        const groupName = isGroup ? groupMetadata.subject : "";
        const groupDesc = isGroup ? groupMetadata.desc : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
        //-----------------------------------------------------------------------//
        const isBotGroupAdmins = groupAdmins.includes(botNumberJid) || false;
        const isGroupAdmins = groupAdmins.includes(sender) || false;
        const isMedia = type === "imageMessage" || type === "videoMessage";
        const isTaggedImage = type === "extendedTextMessage" && content.includes("imageMessage");
        const isTaggedVideo = type === "extendedTextMessage" && content.includes("videoMessage");
        const isTaggedSticker = type === "extendedTextMessage" && content.includes("stickerMessage");
        const isTaggedDocument = type === "extendedTextMessage" && content.includes("documentMessage");

        //-----------------------------send message with reply tag---------------------------------//
        const reply = (taks) => {
            sock.sendMessage(
                from,
                { text: taks },
                { quoted: mek.messages[0] }
            )
        }

        //-----------------------------------Send message without reply tag----------------------------//
        const SendMessageNoReply = (taks) => {
            sock.sendMessage(
                from,
                { text: taks }
            )
        }

        // if (msg.message.stickerMessage) {
        //     reply('yes');
        //     sock.sendMessage(
        //         from,
        //         {
        //             image: { url: msg.message.stickerMessage.url },
        //             mimetype: 'image/webp'
        //         }
        //     )
        // }
        ///////////////////////////////////////////
        //////////////////COMMANDS\\\\\\\\\\\\\\\\\
        ///////////////////////////////////////////
        if (isCmd) {
            // Display every command info
            console.log("[COMMAND] ", command, " [FROM] ", senderNumb, " [name] " + mek.messages[0].pushName + " [IN] ", groupName);
            // Send every command info
            OwnerSend("[COMMAND] " + command + " [FROM] " + senderNumb + " [name] " + mek.messages[0].pushName + " [IN] " + groupName);
            switch (command) {
                case 'help':
                    SendMessageNoReply(userHelp(prefix, groupName))
                    break;
                case 'a':
                case 'alive':
                    if (!isGroup) return;
                    reply(`Hello !! ${mek.messages[0].pushName}\n*Yes I'm Alive*`);
                    break;
                case 'term':
                    if (!allowedNumbs.includes(senderNumb)) {
                        reply("Sorry only for moderators")
                        return;
                    }
                    var k = args.join(' ');
                    console.log(k);
                    var store = await eval(k);
                    console.log(store);
                    var store2 = JSON.stringify(store);
                    reply(`${store2}`);
                    break;
                case 'my':
                    if (!isGroup) return;
                    reply(mek.messages[0].pushName)
                    break;

                //-------------------HORO-----------------------//
                case 'horo':
                    if (!isGroup) return;
                    if (!args[0]) return reply("Enter horo")
                    console.log("SENDER NUMB:", senderNumb);
                    let horoscope = args[0];
                    let h_Low = horoscope.toLowerCase();
                    let l = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
                    if (!l.includes(h_Low)) {
                        reply("Kindly enter the right spelling ")//SAhi se daal bhai,sign 12 he hote hai :)       
                    } else {
                        const callhoro = await gethoro(h_Low);
                        reply(`*Date Range*:-${callhoro.date_range}
 *Nature Hold's For you*:-${callhoro.description}
 *Compatibility*:-${callhoro.compatibility}
 *Mood*:-${callhoro.mood}
 *color*:-${callhoro.color}
 *Lucky Number*:-${callhoro.lucky_number}
 *Lucky time*:-${callhoro.lucky_time}`)
                    }
                    break;

                case 'meme':
                    if (!isGroup) return;
                    reply(`*Sending...*`);
                    const memeURL = 'https://meme-api.herokuapp.com/gimme';
                    axios.get(`${memeURL}`).then((res) => {
                        let url = res.data.url;
                        if (url.includes("jpg") || url.includes("jpeg") || url.includes("png")) {
                            sock.sendMessage(
                                from,
                                {
                                    image: { url: res.data.url },
                                    mimetype: 'image/jpeg',
                                    caption: `${res.data.title}`
                                }
                            );
                        }
                        else {
                            // downloadmeme(res.data.url).then(() => {
                            sock.sendMessage(
                                from,
                                {
                                    video: { url: res.data.url },
                                    caption: "hello!",
                                    gifPlayback: true,
                                }
                            )
                            // fs.unlinkSync("./pic.mp4");
                            // });
                        }
                    }).catch(() => {
                        console.log('Error');
                        reply(`Eror. Contect Dev.`);
                    });
                    break;
                //-----------------------------IDP--------------------------------------------//
                case 'idp':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`_Enter User name after idp_`);
                    let prof = args[0];
                    const idp = async (prof) => {
                        axios({
                            url: `https://www.instagram.com/${prof}/?__a=1`,
                            headers: {
                                accept:
                                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9',
                                'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
                                'cache-control': 'max-age=0',
                                'sec-ch-ua':
                                    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
                                'sec-ch-ua-mobile': '?1',
                                'sec-fetch-dest': 'document',
                                'sec-fetch-mode': 'navigate',
                                'sec-fetch-site': 'none',
                                'sec-fetch-user': '?1',
                                'upgrade-insecure-requests': '1',
                                cookie:
                                    'ig_did=305179C0-CE28-4DCD-847A-2F28A98B7DBF; ig_nrcb=1; mid=YQBN3wAEAAGfSSDsZYS9nf2a5MHO; csrftoken=KItbBYAsObQgmJU2CsfqfiRFtk8JXwgm; sessionid=29386738134%3A8NwzjrA3jruVB4%3A23; ds_user_id=29386738134; fbm_124024574287414=base_domain=.instagram.com; shbid="18377\05429386738134\0541674226938:01f7d2db0f9c512fc79336716e1cf02623129a7897f5ccb8d878999be86c0e010bb77920"; shbts="1642690938\05429386738134\0541674226938:01f73e613a6030436ef5f2cea6c7402b82a96c1a61f905b746d3951f49a7f2d2eab6d399"; fbsr_124024574287414=Ps5NinG2AjNMV4W927e_vwMrZVLCltfcbWGS3B5S3to.eyJ1c2VyX2lkIjoiMTAwMDA5NDY1ODIwODQyIiwiY29kZSI6IkFRQlZrOVljMF9DS24tVEpqZ21VWjdPT2dOelFVdkJyLXUzaENSOGR0RzZrbVQxdWszYUMtVDZJeV9QWjBCc1lCcTBmZkxNZmsyUVlMM0hMVGVhQ1pxb1RRQzdsOE9BYlZKdmlvTU5GZ0dncVdxZVQzNV9JM3ZOV0pCR3BsWXVQX0dGMDJMMEt2aTk4WXpxNFhrVWhaVUNRanpPcUthN01aOVdZaVc5SVFzZjRxU3FQTXUzVXlwRWVsMXQ4TjJkV2ZHSnNFYXRsNXBIRXBGMlJSSWljY0F1c3BTZHNPdWFZSThCeV9uRFpjQklUUFk0RzNJY0NiYnFtdXNFZXY5ZUlsMVlZQ0E0bE5ROWxyeGtZdU1IM05scWRFTmtlQjNwWVRjRGlsZDZtekNpNFgzcnZIZUtUMFVFNkJFYVlURFpCTmhaOTd5TmJWT1R1ZENWdk84UlFoYjV2Iiwib2F1dGhfdG9rZW4iOiJFQUFCd3pMaXhuallCQU0zaHBjU2lKUm50WWcyTm0xamhlUlFkd3VCeExaQ1V0UjV5endGSkdVQVpDbERGRThwdXdaQXRPMkxtQnMxNjNiVGQzZERhRVl3UGRiWHY1bE5PNEZaQVVoYUpBZDBIcTQyWkN5OVdicXh4blVnZml5MHBETm9rMXlQVzlUNHpaQVVsbHVGcmZ4OFFhRlRnZG9wRTBFMDBMaGg3OVhuWkN1QldteWZ0MlpBY1NYVUpMRjNWNzUwWkQiLCJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTY0MjY5NDAyM30; rur="VLL\05429386738134\0541674231548:01f7816fe2a5156acdb86c5eff76c0ae83ac053646c44ccc592f854fb9d24a18bfcfc3ac"',
                            },
                            referrerPolicy: 'strict-origin-when-cross-origin',
                            body: null,
                            mode: 'cors',
                            method: 'GET'
                        }).then((res) => {
                            reply(`_Searching User..._`);
                            sock.sendMessage(
                                from,
                                {
                                    image: { url: res.data.graphql.user.profile_pic_url_hd },
                                    caption: `${prof}`,
                                    quoted: mek
                                }
                            )
                        }).catch((error) => {
                            console.log(error);
                            reply(`_Bad Luck_ :(\nGetting login page!!`);
                        })
                    }
                    idp(prof);
                    break;

                case 'txtmeme':
                case 'text':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`*Use* -testmeme _FontSize;toptext;bottomtext_`);
                    console.log('content ', evv);
                    var TopText, BottomText, FontSize = 0;
                    if (evv.includes(";")) {
                        if (evv.split(";").length == 3) {
                            FontSize = evv.split(";")[0];
                            TopText = evv.split(";")[1];
                            BottomText = evv.split(";")[2];
                        } else if (evv.split(";").length == 2) {
                            TopText = evv.split(";")[0];
                            BottomText = evv.split(";")[1];
                        }
                        else if (evv.split(";").length == 1) {
                            TopText = evv.split(";")[0];
                            BottomText = '';
                        } else {
                            TopText = '';
                            BottomText = '';
                        }
                        OwnerSend('Args: ' + FontSize + ' ' + TopText + ' ' + BottomText);
                        const MemePath = getRandom('.png');
                        if ((isMedia && !mek.messages[0].message.videoMessage || isTaggedImage)) {
                            let downloadFilePath;
                            if (mek.messages[0].message.imageMessage) {
                                downloadFilePath = mek.messages[0].message.imageMessage;
                            } else {
                                downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                            }
                            // console.log(mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage);
                            // const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                            const stream = await downloadContentFromMessage(downloadFilePath, 'image');
                            let buffer = Buffer.from([])
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk])
                            }
                            const media = getRandom('.jpeg');
                            await writeFile(media, buffer)
                            const options = {
                                image: media,
                                outfile: MemePath,
                                topText: TopText,
                                bottomText: BottomText,
                                // font: './../impact.ttf',
                                fontSize: (FontSize == 0) ? 50 : FontSize,
                                // fontFill: '#000000',
                                // textPos: 'center',
                                // strokeColor: '#000',
                                strokeWeight: 1
                            }
                            memeMaker(options).then(() => {
                                sock.sendMessage(
                                    from,
                                    {
                                        image: fs.readFileSync(MemePath),
                                        mimetype: 'image/jpeg',
                                        quoted: mek.messages[0]
                                    }
                                )
                                fs.unlinkSync(MemePath);
                                fs.unlinkSync(media);
                                console.log('Sent');
                            });
                        } else {
                            reply(`*Reply to Image Only*`);
                        }
                    } else {
                        reply(`*Must Include ; to saprate Header and Footer*`);
                    }
                    break;
                case 'jid':
                    if (!isGroup) return;
                    if (!allowedNumbs.includes(senderNumb)) return;
                    reply(from);
                    break;

                //----------------------------------TTS-------------------------------------//
                case 'tts':
                    if (!isGroup) return;
                    var take = evv;
                    OwnerSend(take + " =tts message");
                    let uri = encodeURI(take);
                    async function getTTS() {
                        await axios.get(
                            "https://api.xteam.xyz/attp?file&text=" + uri,
                            { responseType: "arraybuffer" }
                        ).then((ttinullimage) => {
                            sock.sendMessage(
                                from,
                                {
                                    sticker: Buffer.from(ttinullimage.data),
                                }
                            );
                            console.log('sent');
                        }).catch(() => {
                            reply(`_Website is Down_\nWait for Sometime`);
                        });
                    }
                    getTTS();
                    break;


                //----------------------------STICKER--------------------------------------//
                case 'sticker':
                case 's':
                    if (!isGroup) return;
                    // Format should be <prefix>sticker pack <pack_name> author <author_name>
                    var packName = ""
                    var authorName = ""
                    if (mek.messages[0].message.extendedTextMessage) {
                        if (!args);
                        else
                            OwnerSend('Args: ' + args);
                    }
                    // Check if pack keyword is found in args!
                    if (args.includes('pack') == true) {
                        packNameDataCollection = false;
                        for (let i = 0; i < args.length; i++) {
                            // Enables data collection when keyword found in index!
                            if (args[i].includes('pack') == true) {
                                packNameDataCollection = true;
                            }
                            if (args[i].includes('author') == true) {
                                packNameDataCollection = false;
                            }
                            // If data collection is enabled and args length is more then one it will start appending!
                            if (packNameDataCollection == true) {
                                packName = packName + args[i] + ' '
                            }
                        }
                        // Check if variable contain unnecessary startup word!
                        if (packName.startsWith('pack ')) {
                            packName = `${packName.split('pack ')[1]}`
                        }
                    }
                    // Check if author keyword is found in args!
                    if (args.includes('author') == true) {
                        authorNameDataCollection = false;
                        for (let i = 0; i < args.length; i++) {
                            // Enables data collection when keyword found in index!
                            if (args[i].includes('author') == true) {
                                authorNameDataCollection = true;
                            }
                            // If data collection is enabled and args length is more then one it will start appending!
                            if (authorNameDataCollection == true) {
                                authorName = authorName + args[i] + ' '
                            }
                            // Check if variable contain unnecessary startup word!
                            if (authorName.startsWith('author ')) {
                                authorName = `${authorName.split('author ')[1]}`
                            }
                        }
                    }
                    // Check if packName and authorName is empty it will pass default values!
                    if (packName == "") {
                        packName = "MD"
                    }
                    if (authorName == "") {
                        authorName = "BitBot"
                    }
                    outputOptions = [`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`];
                    if ((args.includes('crop') == true) || (args.includes('c') == true)) {
                        outputOptions = [
                            `-vcodec`,
                            `libwebp`,
                            `-vf`,
                            `crop=w='min(min(iw\,ih)\,500)':h='min(min(iw\,ih)\,500)',scale=500:500,setsar=1,fps=15`,
                            `-loop`,
                            `0`,
                            `-ss`,
                            `00:00:00.0`,
                            `-t`,
                            `00:00:10.0`,
                            `-preset`,
                            `default`,
                            `-an`,
                            `-vsync`,
                            `0`,
                            `-s`,
                            `512:512`
                        ];
                    }
                    if ((isMedia && !mek.messages[0].message.videoMessage || isTaggedImage)) {
                        let downloadFilePath;
                        if (mek.messages[0].message.imageMessage) {
                            downloadFilePath = mek.messages[0].message.imageMessage;
                        } else {
                            downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
                        }
                        const stream = await downloadContentFromMessage(downloadFilePath, 'image');
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const media = getRandom('.jpeg');
                        await writeFile(media, buffer)
                        ran = getRandom('.webp')
                        reply('⌛Changing media to sticker⏳')//⌛Ruk Bhai..Kar raha ⏳
                        await ffmpeg(`./${media}`).input(media).on('error', function (err) {
                            fs.unlinkSync(media)
                            console.log(`Error : ${err}`)
                            reply('_❌ ERROR: Failed to convert image into sticker! ❌_')
                        }).on('end', function () {
                            buildSticker()
                        }).addOutputOptions(outputOptions).toFormat('webp').save(ran)
                        async function buildSticker() {
                            if (args.includes('nometadata') == true) {
                                sock.sendMessage(
                                    from,
                                    {
                                        sticker: fs.readFileSync(ran)
                                    });
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                            } else {
                                const sticker1 = new Sticker(ran, {
                                    pack: packName, // The pack name
                                    author: authorName, // The author name
                                })
                                const saveSticker = getRandom('.webp')
                                await sticker1.toFile(saveSticker)
                                sock.sendMessage(
                                    from,
                                    {
                                        sticker: fs.readFileSync(saveSticker)
                                    });
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                                fs.unlinkSync(saveSticker)
                            }
                        }
                    } else if ((isMedia && mek.messages[0].message.videoMessage.seconds < 11 || isTaggedVideo && mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
                        let downloadFilePath;
                        if (mek.messages[0].message.imageMessage) {
                            downloadFilePath = mek.messages[0].message.videoMessage;
                        } else {
                            downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
                        }
                        const stream = await downloadContentFromMessage(downloadFilePath, 'video');
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const media = getRandom('.mp4');
                        await writeFile(media, buffer)
                        ran = getRandom('.webp')
                        reply('⌛Changing media file to Sticker⏳')//⌛ Ho raha Thoda wait karle... ⏳
                        await ffmpeg(`./${media}`).inputFormat(media.split('.')[1]).on('error', function (err) {
                            fs.unlinkSync(media)
                            mediaType = media.endsWith('.mp4') ? 'video' : 'gif'
                            reply(`_❌ ERROR: Failed to convert ${mediaType} to sticker! ❌_`)
                        }).on('end', function () {
                            buildSticker()
                        }).addOutputOptions(outputOptions).toFormat('webp').save(ran)
                        async function buildSticker() {
                            if (args.includes('nometadata') == true) {
                                sock.sendMessage(
                                    from,
                                    {
                                        sticker: fs.readFileSync(ran),
                                    });
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                            } else {
                                const sticker1 = new Sticker(ran, {
                                    pack: packName, // The pack name
                                    author: authorName, // The author name
                                })
                                const saveSticker = getRandom('.webp')
                                await sticker1.toFile(saveSticker)
                                sock.sendMessage(
                                    from,
                                    {
                                        sticker: fs.readFileSync(saveSticker)
                                    });
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                                fs.unlinkSync(saveSticker)
                            }
                        }
                    }
                    else {
                        reply(`❌ *Error reply to image or video only* `);
                        console.log('Error not replyed');
                    }
                    break;
                /* ------------------------------- CASE: DELETE ------------------------------ */
                case "delete":
                case "d":
                    try {
                        if (!msg.message.extendedTextMessage) {
                            reply(`❌ Tag message of bot to delete.`);
                            return;
                        }
                        // console.log('Mek: ',mek.messages[0].message.extendedTextMessage);
                        if (botNumberJid == msg.message.extendedTextMessage.contextInfo.participant) {
                            // SendMessageNoReply('yes')
                            //         await sock.sendMessage(
                            //             from,
                            //             {
                            //                 delete: mek.messages[0].key
                            //             }
                            //         )
                            //     } else {
                            //         reply(`❌ Tag message of bot to delete.`);
                        }
                    } catch (err) {
                        console.log(err);
                        reply(`❌ Error!`);
                    }
                    const response = await sock.sendMessage(from, { text: 'hello!' }) // send a message
                    console.log(response.key);
                    // sends a message to delete the given message
                    // this deletes the message for everyone
                    await sock.sendMessage(from, { delete: response.key })
                    break;

                default:
                    if (isGroup)
                        reply(`*Error Not Added All commands*`)
            }
        }
    });
    // //------------------------connection.update------------------------------//
    // sock.ev.on("connection.update", (update) => {
    //     const { connection, lastDisconnect } = update;
    //     if (connection === "close") {
    //         // reconnect if not logged out
    //         if (
    //             (lastDisconnect.error &&
    //                 lastDisconnect.error.output &&
    //                 lastDisconnect.error.output.statusCode) !== DisconnectReason.loggedOut
    //         ) {
    //             startSock();
    //         } else {
    //             console.log("Connection closed. You are logged out.");
    //         }
    //     }
    //     console.log("connection update1", update);
    // });
    // listen for when the auth credentials is updated
    // sock.ev.on("creds.update", saveState);
    // return sock;
};
startSock();
