require('dotenv').config()
const axios = require('axios')
const { writeFile } = require('fs/promises')
const fs = require('fs')
const memeMaker = require('@erickwendel/meme-maker')
const ffmpeg = require('fluent-ffmpeg')//sticker module
const { Sticker } = require('wa-sticker-formatter')
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

//-----------------------------------CONST--------------------------//
const OwnerNumb = process.env.OWNER_NUMB + '@s.whatsapp.net';
const prefix = '.';
const allowedNumbs = ["918318585418"];
const INSTA_API_KEY = process.env.INSTA_API_KEY;
const P = require("pino");
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` }
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi(INSTA_API_KEY);
//---------------------------------------------------------------------------------------//

let MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const store = makeInMemoryStore({ logger });


// store.readFromFile("./baileys_store_multi.json");
// // save every 10s
// setInterval(() => {
//     store.writeToFile("./baileys_store_multi.json");
// }, 10_000);

// const { getAuthMD, setAuthMD } = require("./DB/authMD");
// let state = getAuthMD();

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");
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

    //************************************************************/
    const { downloadmeme } = require('./plugins/meme')
    const { userHelp, adminList } = require('./plugins/help')
    const { EmojiAPI } = require('emoji-api')
    const emoji = new EmojiAPI();
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
    //classic Dictionary
    async function dictionary(word) {
        var config = {
            method: 'GET',
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        }
        let classic;
        await axios.request(config).then((res) => {
            classic = res.data[0];
        }).catch((error) => {
            return;
        })
        return classic;
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

        //----------------------------GET ADMINS-------------------------------//
        const getGroupAdmins = (participants) => {
            admins = [];
            for (let i of participants) {
                ((i.admin == 'admin') || (i.admin == 'superadmin')) ? admins.push(i.id) : "";
            }
            return admins;
        };
        const getSupperAdmin = (participants) => {
            admins = [];
            for (let i of participants) {
                if (i.admin == 'superadmin') {
                    admins.push(i.id);
                    return admins;
                }
            }
        }
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
        const senderjid = sender.includes(":") ? sender.slice(0, sender.search(":")) + '@' + sender.split("@")[1] : sender;
        //-----------------------------------------------------------------------//
        const groupName = isGroup ? groupMetadata.subject : "";
        const groupDesc = isGroup ? groupMetadata.desc : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
        //-----------------------------------------------------------------------//
        const isBotGroupAdmins = groupAdmins.includes(botNumberJid) || false;
        const isGroupAdmins = groupAdmins.includes(senderjid) || false;
        const SuperAdmin = getSupperAdmin(groupMembers);
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
        //-------------------------------------------------------------------------------------------------//
        //-------------------------------------------------------------------------------------------------//
        //-----------------------------JOKE-------------------------------//
        async function jokeFun(take) {
            const baseURL = "https://v2.jokeapi.dev";
            const categories = (!take) ? "Any" : take;
            const cate = [
                "Programming",
                "Misc",
                "Dark",
                "Pun",
                "Spooky",
                "Chrimstmas"
            ]
            if (categories != "Any" && !(cate.includes(take))) return reply(`*Wrong Categories*\n *_Type any one_* :  *${cate
                }*`);
            const params = "blacklistFlags=religious,racist";
            axios.get(`${baseURL
                }/joke/${categories
                }?${params
                }`).then((res) => {
                    let randomJoke = res.data;
                    if (randomJoke.type == "single") {
                        mess = 'Category => ' + randomJoke.category + '\n\n' + randomJoke.joke;
                        reply(mess);
                    }
                    else {
                        mess = 'Category => ' + randomJoke.category + '\n\n' + randomJoke.setup + '\n' + randomJoke.delivery;
                        reply(mess);
                    }
                    console.log("Categories => ", categories);;
                });
        }
        //-----------------------------------------ADVICE---------------------------------------------------//
        async function getRandomAD() {
            await axios(`https://api.adviceslip.com/advice`).then((res) => {
                reply(`🍬  🎀  𝒜𝒹𝓋𝒾𝒸𝑒  🎀  🍬\n` + "```" + res.data.slip.advice + "```");
            }).catch((error) => {
                console.log('error', error);
                reply(`Error`);
            })
        }
        //--------------------------------------------------DM-------------------------------------------------//
        if (!isGroup)
            reply(`ʜᴇʟʟᴏ ${mek.messages[0].pushName}\nɪ'ᴍ ʙɪᴛʙᴏᴛ ᴀ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ʙᴜᴛ ɪ ᴅᴏɴ'ᴛ ᴡᴏʀᴋ ɪɴ ᴅɪʀᴇᴄᴛ ᴍᴇꜱꜱᴀɢᴇꜱ (ᴅᴍ). ꜱᴏ, ᴅᴏɴ'ᴛ ꜱᴘᴀᴍ ʜᴇʀᴇ./nᴛʜᴀɴᴋꜱ`);
        //----------------------------------------------------------------------------------------------------//
        ///////////////////////////////////////////
        //////////////////COMMANDS\\\\\\\\\\\\\\\\\
        ///////////////////////////////////////////
        if (isCmd) {
            // Display every command info
            console.log("[COMMAND]", command, "[FROM]", senderNumb, "[name]" + mek.messages[0].pushName + "[IN]", groupName);
            // Send every command info to Owner
            OwnerSend("[COMMAND] " + command + " [FROM] " + senderNumb + " [name] " + mek.messages[0].pushName + " [IN] " + groupName);
            switch (command) {
                //------------------HELP------------------------------------------------------//
                case 'help':
                    if (!isGroup) return;
                    SendMessageNoReply(userHelp(prefix, groupName, mek.messages[0].pushName));
                    break;
                //------------------------------ADMIN---------------------------------------//
                case 'admin':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(sender)) return reply('```kya matlab tum admin nhi ho 🙄```');
                    SendMessageNoReply(adminList(prefix, groupName, mek.messages[0].pushName));
                    break;
                //-------------------------------------ALIVE------------------------------------//
                case 'a':
                case 'alive':
                    if (!isGroup) return;
                    reply("```⌊ *Hǝllo*!! " + mek.messages[0].pushName + " ⌋\n\n\n🫠🅈🄴🅂 🄸'🄼 🄰🄻🄸🅅🄴🫠```");
                    break;
                //-------------------------TERMINAL------------------------------//
                case 'term':
                    if (!allowedNumbs.includes(senderNumb)) {
                        reply("```Sorry only for moderators```")
                        return;
                    }
                    var k = args.join(' ');
                    console.log(k);
                    try {
                        var store = await eval(k);
                        console.log(store);
                        var store2 = JSON.stringify(store);
                        reply(`${store2}`);
                    } catch (err) {
                        reply(`Error See Log WhatsApp Number to know more`);
                        return OwnerSend('Term: ' + err);
                    }
                    break;
                //---------------------------MY-NAME--------------------------//
                case 'my':
                    if (!isGroup) return;
                    reply(mek.messages[0].pushName)
                    break;
                //----------------------JOKE----------------------------//
                case 'joke':
                    if (!isGroup) return;
                    jokeFun(args[0]);
                    break;
                //-------------------------------ADVICE----------------------//
                case 'advice':
                    if (!isGroup) return;
                    getRandomAD();
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

                /* ------------------------------- CASE: INSTA ------------------------------ */
                case "insta":
                case "i":
                    if (!isGroup) {
                        reply("❌ Group command only!");
                        return;
                    }
                    if (args.length === 0) {
                        reply(`❌ URL is empty! \nSend ${prefix}insta url`);
                        return;
                    }
                    let urlInsta = args[0];
                    if (
                        !(
                            urlInsta.includes("instagram.com/p/") ||
                            urlInsta.includes("instagram.com/reel/") ||
                            urlInsta.includes("instagram.com/tv/")
                        )
                    ) {
                        reply(
                            `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.`
                        );
                        return;
                    }
                    if (urlInsta.includes("?"))
                        urlInsta = urlInsta.split("/?")[0];
                    console.log(urlInsta);
                    OwnerSend("Downloading URL : " + urlInsta);
                    reply(`*Downloading...Pls wait*`);
                    // axios.get(`https://api-xcoders.xyz/api/download/ig?url=${urlInsta}/?igshid=g26k5coikzwr&apikey=${INSTA_API_KEY}`).then((response) => {
                    //     if (response.data.status == true) {
                    //         if (response.data.result.media_count == 1) {
                    //             if (response.data.result.type == "image") {
                    //                 sock.sendMessage(
                    //                     from,
                    //                     {
                    //                         image: { url: response.data.result.url },
                    //                         caption: `${response.data.result.caption}`
                    //                     },
                    //                     { quoted: mek.messages[0] }
                    //                 )
                    //                 console.log('sent');
                    //             }
                    //             else if (response.data.result.type == "video") {
                    //                 sock.sendMessage(
                    //                     from,
                    //                     {
                    //                         video: { url: response.data.result.url },
                    //                         caption: `${response.data.result.caption}`
                    //                     },
                    //                     { quoted: mek.messages[0] }
                    //                 )
                    //                 console.log('sent');
                    //             }
                    //             else {
                    //                 reply(`Not Media Type Found`);
                    //             }
                    //         }
                    //         else if (response.data.result.media_count > 1) {
                    //             for (let i = 0; i < response.data.result.media_count; i++) {
                    //                 if (response.data.result.result_url[i].type == "image") {
                    //                     sock.sendMessage(
                    //                         from,
                    //                         {
                    //                             image: { url: response.data.result.result_url[i].url },
                    //                             caption: `*Post*: ${i + 1}`
                    //                         },
                    //                         { quoted: mek.messages[0] }
                    //                     )
                    //                     console.log('sent');
                    //                 }
                    //                 if (response.data.result.result_url[i].type == "video") {
                    //                     sock.sendMessage(
                    //                         from,
                    //                         {
                    //                             video: { url: response.data.result.result_url[i].url },
                    //                             caption: `*Post*:${i + 1}`
                    //                         },
                    //                         { quoted: mek.messages[0] }
                    //                     )
                    //                     console.log('sent');
                    //                 }
                    //             }
                    //         }
                    //         else {
                    //             console.log('media count not found');
                    //         }
                    //     }
                    //     else if (response.data.status == false) {
                    //         reply(`*Post is Private.*`);
                    //         console.log('error');
                    //     }
                    // })
                    ig.fetchPost(urlInsta).then((res) => {
                        if (res.media_count == 1) {
                            if (res.links[0].type == "video") {
                                sock.sendMessage(
                                    from,
                                    {
                                        video: { url: res.links[0].url }
                                    },
                                    { quoted: mek.messages[0] }
                                )
                            } else if (res.links[0].type == "image") {
                                sock.sendMessage(
                                    from,
                                    {
                                        image: { url: res.links[0].url }
                                    },
                                    { quoted: mek.messages[0] }
                                )
                            }
                        } else if (res.media_count > 1) {
                            for (let i; i < res.media_count; i++) {
                                if (res.links[0].type == "video") {
                                    sock.sendMessage(
                                        from,
                                        {
                                            video: { url: res.links[0].url }
                                        },
                                        { quoted: mek.messages[0] }
                                    )
                                } else if (res.links[0].type == "image") {
                                    sock.sendMessage(
                                        from,
                                        {
                                            image: { url: res.links[0].url }
                                        },
                                        { quoted: mek.messages[0] }
                                    )
                                }
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                        reply('Error');
                    });
                    break;

                //-----------------------------------EMOJI-TO-STICKER------------------------------//
                case 'pmoji':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`❌ Enter emoji after pmoji`);
                    OwnerSend('Args: ' + evv);
                    console.log('Args:', args);
                    emoji.get(args[0]).then((response) => {
                        let UrlEmoji = '';
                        if (args.length == 1) {
                            for (let i of response.images) {
                                if (i.vendor.toLowerCase() == 'whatsapp')
                                    UrlEmoji = i.url;
                            }
                        } else if (args.length == 2) {
                            for (let i of response.images) {
                                if (i.vendor.toLowerCase() == args[1].toLowerCase())
                                    UrlEmoji = i.url;
                            }
                        }
                        if (UrlEmoji == '') return reply('Emoji not Found for Args');
                        sock.sendMessage(
                            from,
                            {
                                image: { url: `${UrlEmoji}` },
                                caption: `Emoji: ${response.emoji}
Unicode: ${response.unicode}
Name: ${response.name}`
                            }
                        )
                    }).catch((error) => {
                        reply(`❌ Emoji not found!!`);
                        console.log(error);
                    })
                    break;
                //-----------------------DIC-----------------------------//
                case 'dic':
                    if (!isGroup) return;
                    let w = args[0]
                    try {
                        const dice = await dictionary(w)
                        console.log(dice.word);
                        reply(`*Term*:- ${dice.word}
  *Pronounciation*:- ${dice.phonetic}
  *Meaning*: ${dice.meanings[0].definitions[0].definition}
  *Example*: ${dice.meanings[0].definitions[0].example}`)
                    } catch (err) {
                        return reply(`Sorry Word Not Found`)
                    }
                    break;
                //--------------------------MEME---------------------------------//
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
                                    caption: `${res.data.title}`
                                },
                                { quoted: mek.messages[0] }
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
                                },
                                { quoted: mek.messages[0] }
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
                                    caption: `*Username:* ${res.data.graphql.user.username}
*Bio:* ${res.data.graphql.user.biography}
*Followers:* ${res.data.graphql.user.edge_followed_by.count}
*Following:* ${res.data.graphql.user.edge_follow.count}`,
                                },
                                { quoted: mek.messages[0] }
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
                                    },
                                    { quoted: mek.messages[0] }
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
                    var packName = ""
                    var authorName = ""
                    if (mek.messages[0].message.extendedTextMessage) {
                        if (!args);
                        else
                            OwnerSend('Args: ' + args);
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
                        if (!mek.messages[0].message.extendedTextMessage) return reply(`❌ Tag message of bot to delete.`);
                        if (!(mek.messages[0].message.extendedTextMessage.contextInfo.participant == botNumberJid)) {
                            reply(`❌ Tag message of bot to delete.`);
                            return;
                        }
                        const options = {
                            remoteJid: botNumberJid,
                            fromMe: true,
                            id: mek.messages[0].message.extendedTextMessage.contextInfo.stanzaId
                        }
                        await sock.sendMessage(
                            from,
                            {
                                delete: options
                            }
                        )

                    } catch (err) {
                        console.log(err);
                        reply(`❌ Error!`);
                    }
                    break;
                ///////////////////////\\\\\\\\\\\\\\\\\\\\\\
                ////////////////////ADMIN\\\\\\\\\\\\\\\\\\\\\
                //////////////////////////////////////////////
                //------------------------ADD-----------------------------//
                case 'add':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ Kya lagta hai mai bina admin powers ke add kar sakta hm?`);
                    let taggedJid;
                    if (mek.messages[0].message.extendedTextMessage) {
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant)
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        console.log(taggedJid);
                    }
                    else {
                        if (!args[0]) return reply(`❌ give number or tag on message`);
                        taggedJid = evv + '@s.whatsapp.net';
                    }
                    try {
                        await sock.groupParticipantsUpdate(
                            from,
                            [taggedJid],
                            "add"
                        )
                    } catch (err) {
                        console.log('error', err);
                    }
                    break;
                //-----------------------------------REMOVE------------------------------------//
                case 'remove':
                case 'ban':
                case 'kick':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ kya lagta hai mai bina admin powers ke kick kar sakta hm?`);
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        if (allowedNumbs.includes(taggedJid.split("@")[0])) return reply(`❌ You Can't remove Owner`);
                        if (taggedJid == botNumberJid) return reply(`❌ Can't remove myself`);
                        if (SuperAdmin.includes(taggedJid)) return reply(`❌ Can't remove SuperAdmin`);
                        await sock.groupParticipantsUpdate(
                            from,
                            [taggedJid],
                            "remove"
                        )
                    } catch (err) {
                        console.log('error', err);
                    }
                    break;
                //-----------------------------------------PROMOTE-------------------------//
                case 'promote':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ kya lagta hai mai bina admin powers ke promote kar sakta hm?`);
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        await sock.groupParticipantsUpdate(
                            from,
                            [taggedJid],
                            "promote"
                        )
                        reply(`✔️ *Promoted!!*`)
                    } catch (err) {
                        console.log('error', err);
                    }
                    break;
                //-------------------------------DEMOTE--------------------------------//
                case 'demote':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ kya lagta hai mai bina admin powers ke demote kar sakta hm?`);
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        if (groupAdmins.includes(OwnerNumb))
                            if (allowedNumbs.includes(taggedJid.split("@")[0])) return reply(`❌ You Can't demote Owner`);
                        if (taggedJid == botNumberJid) return reply(`❌ Can't demote myself`);
                        if (SuperAdmin.includes(taggedJid)) return reply(`❌ Can't demote SuperAdmin`);
                        await sock.groupParticipantsUpdate(
                            from,
                            [taggedJid],
                            "demote"
                        )
                        reply(`✔️ *Demoted!!*`)
                    } catch (err) {
                        console.log('error', err);
                    }
                    break;
                default:
                    if (isGroup)
                        reply(`*Error Not Added All commands*`);
            }
        }
    });
    //------------------------connection.update------------------------------//
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            // reconnect if not logged out
            if (
                (lastDisconnect.error &&
                    lastDisconnect.error.output &&
                    lastDisconnect.error.output.statusCode) !== DisconnectReason.loggedOut
            ) {
                startSock();
            } else {
                console.log("Connection closed. You are logged out.");
            }
        }
        console.log("connection update", update);
    });
    // listen for when the auth credentials is updated
    // sock.ev.on("creds.update", saveState)
    return sock;
};
startSock();
