// WEB SERVER
require("dotenv").config();
const express = require('express')
const server = express()
const axios = require('axios');
const https = require("https");
const ud = require('urban-dictionary')
const inshorts = require('inshorts-api');
const fs = require('fs');
const { writeFile } = require('fs/promises')
const P = require("pino");
const videofy = require("videofy")
const deepai = require('deepai');
const ytdl = require('ytdl-core');
const memeMaker = require('@erickwendel/meme-maker')
const ffmpeg = require('fluent-ffmpeg')//sticker module
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const deepAI = process.env.DEEPAI_KEY;
const port = process.env.PORT || 8000;
server.get('/', (req, res) => { res.send('V-Bot server running...') })
server.listen(port, () => {
    // console.clear()
    console.log('\nWeb-server running!\n')
})

//loading plugins
const INSTA_API_KEY = process.env.INSTA_API_KEY;
const { getGender } = require('./plugins/gender') //gender module
const { getAnimeRandom } = require('./plugins/anime') //anime module
const { getFact } = require('./plugins/fact') //fact module
const { HelpGUI } = require('./plugins/helpGui')
const { downloadAll, downloadholly, downloadbolly } = require('./plugins/movie') //movie module
const { setCountWarning, getCountWarning, removeWarnCount } = require('./DB/warningDB') // warning module
const { getBlockWarning, setBlockWarning, removeBlockWarning } = require('./DB/blockDB') //block module 
const { userHelp, StockList, adminList, helpDM } = require('./plugins/help') //help module
const { getRemoveBg } = require('./plugins/removebg'); // removebg module
const { downloadmeme } = require('./plugins/meme') // meme module
const { getCricketScore } = require("./plugins/cricket");
const { getScoreCard } = require("./plugins/cricketScoreCard");
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi(INSTA_API_KEY);
ig.setCookie(INSTA_API_KEY);
const { EmojiAPI } = require('emoji-api');
const emoji = new EmojiAPI();

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
//------------------Baileys Const-------------------//
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
//------------------------------CONSTS----------------------//
const {
    VKontakte,
    Instagram,
    Facebook,
    Snapchat,
    Twitter,
    YouTube,
    TikTok
} = require('social-downloader-sdk');

const {
    setCountMember,
    getCountGroups,
    getCountGroupMembers,
    getCountIndividual,
    getCountIndividualAllGroup,
    getCountIndividualAllGroupWithName,
    getCountTop,
} = require("./DB/countMessDB");

const {
    getCountDM,
    setCountDM,
    removeCountDM,
    setCountDMOwner
} = require('./DB/countDMDB');

let MAIN_LOGGER = P({ timestamp: () => `,"time ":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = 'warn';

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");
const db = require('./database');
let cred, auth_row_count;
async function fetchauth() {
    try {
        auth_result = await db.query('select * from auth;');//checking auth table
        console.log('Fetching login data...')
        auth_row_count = await auth_result.rowCount;
        let data = auth_result.rows[0];
        // console.log("data ",data);
        if (auth_row_count == 0) {
            console.log('No login data found!')
        } else {
            console.log('Login data found!');
            cred = {
                creds: {
                    noiseKey: {
                        private: data.noicekeyprvt,
                        public: data.noicekeypub
                    },
                    signedIdentityKey: {
                        private: data.signedidentitykeyprvt,
                        public: data.signedidentitykeypub
                    },
                    signedPreKey: {
                        keyPair: {
                            private: data.signedprekeypairprv,
                            public: data.signedprekeypairpub
                        },
                        signature: data.signedprekeysignature,
                        keyId: Number(data.signedprekeyidb)
                    },
                    registrationId: Number(data.registrationidb),
                    advSecretKey: data.advsecretkeyb,
                    nextPreKeyId: Number(data.nextprekeyidb),
                    firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyidb),
                    serverHasPreKeys: Boolean(data.serverhasprekeysb),
                    account: {
                        details: data.accountdetailsb,
                        accountSignatureKey: data.accountsignaturekeyb,
                        accountSignature: data.accountsignatureb,
                        deviceSignature: data.devicesignatureb
                    },
                    me: {
                        id: data.meidb,
                        verifiedName: data.meverifiednameb,
                        name: data.menameb
                    },
                    signalIdentities: [
                        {
                            identifier: {
                                name: data.signalidentitiesnameb,
                                deviceId: Number(data.signalidentitiesdeviceidb)
                            },
                            identifierKey: data.signalidentitieskey
                        }
                    ],
                    // lastAccountSyncTimestamp: Number(data.lastaccountsynctimestampb),
                    myAppStateKeyId: data.myappstatekeyidb
                },
                keys: state.keys
            }
            //---------------noiceKey----------------//
            let noiceKeyPrvt = [], noiceKeyPub = [];
            let noiceKeyPrvtB = cred.creds.noiseKey.private.slice(1).split("+");
            let noiceKeyPubB = cred.creds.noiseKey.public.slice(1).split("+");
            for (let i = 0; i < noiceKeyPrvtB.length; i++) {
                noiceKeyPrvt.push(parseInt(noiceKeyPrvtB[i]));
            }
            for (let i = 0; i < noiceKeyPubB.length; i++) {
                noiceKeyPub.push(parseInt(noiceKeyPubB[i]));
            }
            cred.creds.noiseKey.private = Buffer.from(noiceKeyPrvt);
            cred.creds.noiseKey.public = Buffer.from(noiceKeyPub);
            //------------------------------------------//
            //----------------signedIdentityKey---------//
            let signedIdentityKeyPrvt = [], signedIdentityKeyPub = [];
            let signedIdentityKeyPrvtB = cred.creds.signedIdentityKey.private.slice(1).split("+");
            let signedIdentityKeyPubB = cred.creds.signedIdentityKey.public.slice(1).split("+");
            for (let i = 0; i < signedIdentityKeyPrvtB.length; i++) {
                signedIdentityKeyPrvt.push(parseInt(signedIdentityKeyPrvtB[i]));
            }
            for (let i = 0; i < signedIdentityKeyPubB.length; i++) {
                signedIdentityKeyPub.push(parseInt(signedIdentityKeyPubB[i]));
            }
            cred.creds.signedIdentityKey.private = Buffer.from(signedIdentityKeyPrvt);
            cred.creds.signedIdentityKey.public = Buffer.from(signedIdentityKeyPub);
            //------------------------------------------//
            //----------------signedPreKey------------------//
            let signedPreKeyPairPrv = [], signedPreKeyPairPub = [];
            let signedPreKeyPairPrvB = cred.creds.signedPreKey.keyPair.private.slice(1).split("+");
            let signedPreKeyPairPubB = cred.creds.signedPreKey.keyPair.public.slice(1).split("+");
            for (let i = 0; i < signedPreKeyPairPrvB.length; i++) {
                signedPreKeyPairPrv.push(parseInt(signedPreKeyPairPrvB[i]));
            }
            for (let i = 0; i < signedPreKeyPairPubB.length; i++) {
                signedPreKeyPairPub.push(parseInt(signedPreKeyPairPubB[i]));
            }
            cred.creds.signedPreKey.keyPair.private = Buffer.from(signedPreKeyPairPrv);
            cred.creds.signedPreKey.keyPair.public = Buffer.from(signedPreKeyPairPub);
            //------------------------------------------//
            let signedPreKeySignature = [];
            let signedPreKeySignatureB = cred.creds.signedPreKey.signature.slice(1).split("+");
            for (let i = 0; i < signedPreKeySignatureB.length; i++) {
                signedPreKeySignature.push(parseInt(signedPreKeySignatureB[i]));
            }
            cred.creds.signedPreKey.signature = Buffer.from(signedPreKeySignature);
            //-----------------------------------------------//
            //---------------------------signalIdentities-----//
            let signalIdentitiesKey = [];
            let signalIdentitiesKeyB = cred.creds.signalIdentities[0].identifierKey.slice(1).split("+");
            for (let i = 0; i < signalIdentitiesKeyB.length; i++) {
                signalIdentitiesKey.push(parseInt(signalIdentitiesKeyB[i]));
            }
            cred.creds.signalIdentities[0].identifierKey = Buffer.from(signalIdentitiesKey);
            // console.log("Auth : ", cred.creds.signalIdentities);
            //---------------------------------------------------//
        }
    } catch (err) {
        console.log('Creating database...')//if login fail create a db
        await db.query('CREATE TABLE auth(noiceKeyPrvt text, noiceKeyPub text, signedIdentityKeyPrvt text, signedIdentityKeyPub text, signedPreKeyPairPrv text, signedPreKeyPairPub text, signedPreKeySignature text, signedPreKeyIdB text, registrationIdB text, advSecretKeyB text, nextPreKeyIdB text, firstUnuploadedPreKeyIdB text, serverHasPreKeysB text, accountdetailsB text, accountSignatureKeyB text, accountSignatureB text, deviceSignatureB text, meIdB text, meverifiedNameB text, menameB text, signalIdentitiesNameB text, signalIdentitiesDeviceIDB text, signalIdentitiesKey text, lastAccountSyncTimestampB text, myAppStateKeyIdB text);');
        await fetchauth();
    }
}

/*****************|SONG|*****************/
const findSong = async (sname) => {
    const yts = require('yt-search')
    const r = await yts(`${sname}`)
    const videos = r.videos.slice(0, 3)
    let st = videos[0].url;
    return st;
}


// BASIC SETTINGS
prefix = '.';
const OwnerNumb = process.env.myNumber + '@s.whatsapp.net';
source_link = '```https://github.com/jacktheboss220/myBitBot-MD```';

let allowedNumbs = ["917070224546", "918318585418", "916353553554"];//enter your own no. for having all the super user previlage
const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` }

// TECH NEWS ---------------------------

const url = "https://news-pvx.herokuapp.com/";
let latestNews = "TECH NEWS--------";

const getNews = async () => {
    const { data } = await axios.get(url);
    console.log(typeof data);
    let count = 0;

    let news = `☆☆☆☆☆💥 Tech News 💥☆☆☆☆☆ \n\n ${readMore}`;
    data["inshorts"].forEach((headline) => {
        count += 1
        if (count > 13) return;
        news = news + "🌐 " + headline + "\n\n";
    });
    return news;
};

const postNews = async (categry) => {
    console.log(categry)
    let n = '';
    let z = categry;
    let arr = ['national', 'business', 'sports', 'world', 'politics', 'technology', 'startup', 'entertainment', 'miscellaneous', 'hatke', 'science', 'automobile'];
    if (!arr.includes(z)) {
        return "Enter a valid category:) or use -category for more info:)";
    }
    var options = {
        lang: 'en',
        category: z,
        numOfResults: 13
    }
    n = `☆☆☆☆☆💥 ${z.toUpperCase()} News 💥☆☆☆☆☆ \n\n ${readMore}`
    await inshorts.get(options, function (result) {
        for (let i = 0; i < result.length; i++) {
            temp = "🌐 " + result[i].title + "\n";
            n = n + temp + "\n";
        }
    }).catch((er) => "");

    return n;
}
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

// MAIN FUNTION
const startSock = async () => {
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    let noLogs = P({ level: "silent" }); //to hide the chat logs
    await fetchauth();
    const sock = makeWASocket({
        version,
        logger: noLogs,
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: true,
        auth: cred,
    });
    //-------------------------------BOT-NUMBER------------------------------//
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('Connected');
            try {
                //---------------noiceKey----------------//
                let noiceKeyPrvt = '', noiceKeyPub = '';
                let noiceKeyPrvtB = state.creds.noiseKey.private.toJSON().data;
                let noiceKeyPubB = state.creds.noiseKey.public.toJSON().data;
                for (let i = 0; i < noiceKeyPrvtB.length; i++) {
                    noiceKeyPrvt += '+' + noiceKeyPrvtB[i].toString();
                }
                for (let i = 0; i < noiceKeyPubB.length; i++) {
                    noiceKeyPub += '+' + noiceKeyPubB[i].toString();
                }
                //------------------------------------------//
                //----------------signedIdentityKey---------//
                let signedIdentityKeyPrvt = '', signedIdentityKeyPub = '';
                let signedIdentityKeyPrvtB = state.creds.signedIdentityKey.private.toJSON().data;
                let signedIdentityKeyPubB = state.creds.signedIdentityKey.public.toJSON().data;
                for (let i = 0; i < signedIdentityKeyPrvtB.length; i++) {
                    signedIdentityKeyPrvt += '+' + signedIdentityKeyPrvtB[i].toString();
                }
                for (let i = 0; i < signedIdentityKeyPubB.length; i++) {
                    signedIdentityKeyPub += '+' + signedIdentityKeyPubB[i].toString();
                }
                //------------------------------------------//
                //----------------signedPreKeyPair--------------//
                let signedPreKeyPairPrv = '', signedPreKeyPairPub = '';
                let signedPreKeyPairPrvB = state.creds.signedPreKey.keyPair.private;
                let signedPreKeyPairPubB = state.creds.signedPreKey.keyPair.public;
                for (let i = 0; i < signedPreKeyPairPrvB.length; i++) {
                    signedPreKeyPairPrv += '+' + signedPreKeyPairPrvB[i].toString();
                }
                for (let i = 0; i < signedPreKeyPairPubB.length; i++) {
                    signedPreKeyPairPub += '+' + signedPreKeyPairPubB[i].toString();
                }
                //------------------------------------------//
                //------------------signedPreKeySignature**---//
                let signedPreKeySignature = '';
                let signedPreKeySignatureB = state.creds.signedPreKey.signature;
                for (let i = 0; i < signedPreKeySignatureB.length; i++) {
                    signedPreKeySignature += '+' + signedPreKeySignatureB[i].toString();
                }
                let signedPreKeyIdB = state.creds.signedPreKey.keyId;
                //---------------------------------------------//
                //------------------AutoKeys--------------------//
                let registrationIdB = state.creds.registrationId;
                let advSecretKeyB = state.creds.advSecretKey;
                let nextPreKeyIdB = state.creds.nextPreKeyId;
                let firstUnuploadedPreKeyIdB = state.creds.firstUnuploadedPreKeyId;
                let serverHasPreKeysB = state.creds.serverHasPreKeys;
                //-----------------------------------------------//
                //---------------------account-----------------//
                let accountdetailsB = state.creds.account.details;
                let accountSignatureKeyB = state.creds.account.accountSignatureKey;
                let accountSignatureB = state.creds.account.accountSignature;
                let deviceSignatureB = state.creds.account.deviceSignature;
                //----------------------ME------------------------//
                let meIdB = state.creds.me.id;
                let meverifiedNameB = state.creds.me.verifiedName;
                let menameB = state.creds.me.name;
                //--------------------------------------------------//
                //----------------------signalIdentities------------//
                let signalIdentitiesNameB = state.creds.signalIdentities[0].identifier.name;
                let signalIdentitiesDeviceIDB = state.creds.signalIdentities[0].identifier.deviceId;
                let signalIdentitiesKey = '';
                let signalIdentitiesKeyB = state.creds.signalIdentities[0].identifierKey.toJSON().data;
                for (let i = 0; i < signalIdentitiesKeyB.length; i++) {
                    signalIdentitiesKey += '+' + signalIdentitiesKeyB[i].toString();
                }
                //----------------------------------------------------//
                let lastAccountSyncTimestampB = state.creds.lastAccountSyncTimestamp;
                let myAppStateKeyIdB = state.creds.myAppStateKeyId;
                // INSERT / UPDATE LOGIN DATA
                if (auth_row_count == 0) {
                    console.log('Inserting login data...');
                    db.query('INSERT INTO auth VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25);', [noiceKeyPrvt, noiceKeyPub, signedIdentityKeyPrvt, signedIdentityKeyPub, signedPreKeyPairPrv, signedPreKeyPairPub, signedPreKeySignature, signedPreKeyIdB, registrationIdB, advSecretKeyB, nextPreKeyIdB, firstUnuploadedPreKeyIdB, serverHasPreKeysB, accountdetailsB, accountSignatureKeyB, accountSignatureB, deviceSignatureB, meIdB, meverifiedNameB, menameB, signalIdentitiesNameB, signalIdentitiesDeviceIDB, signalIdentitiesKey, lastAccountSyncTimestampB, myAppStateKeyIdB]);
                    db.query('commit;');
                    console.log('New login data inserted!');
                } else {
                    console.log('Updating login data....');
                    db.query('UPDATE auth SET noiceKeyPrvt = $1, noiceKeyPub = $2, signedIdentityKeyPrvt = $3, signedIdentityKeyPub = $4, signedPreKeyPairPrv = $5, signedPreKeyPairPub = $6, signedPreKeySignature = $7, signedPreKeyIdB = $8, registrationIdB = $9, advSecretKeyB = $10, nextPreKeyIdB = $11, firstUnuploadedPreKeyIdB = $12, serverHasPreKeysB = $13, accountdetailsB = $14, accountSignatureKeyB = $15, accountSignatureB = $16, deviceSignatureB = $17, meIdB = $18, meverifiedNameB =$19, menameB =$20, signalIdentitiesNameB =$21, signalIdentitiesDeviceIDB =$22, signalIdentitiesKey =$23, lastAccountSyncTimestampB =$24, myAppStateKeyIdB =$25;', [noiceKeyPrvt, noiceKeyPub, signedIdentityKeyPrvt, signedIdentityKeyPub, signedPreKeyPairPrv, signedPreKeyPairPub, signedPreKeySignature, signedPreKeyIdB, registrationIdB, advSecretKeyB, nextPreKeyIdB, firstUnuploadedPreKeyIdB, serverHasPreKeysB, accountdetailsB, accountSignatureKeyB, accountSignatureB, deviceSignatureB, meIdB, meverifiedNameB, menameB, signalIdentitiesNameB, signalIdentitiesDeviceIDB, signalIdentitiesKey, lastAccountSyncTimestampB, myAppStateKeyIdB])
                    db.query('commit;');
                    console.log('Login data updated!');
                }
            } catch { }
        }
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


    // const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
    //     await sock.presenceSubscribe(jid)
    //     await delay(500)
    //     await sock.sendPresenceUpdate('composing', jid)
    //     await delay(2000)
    //     await sock.sendPresenceUpdate('paused', jid)
    //     await sock.sendMessage(jid, msg)
    // }
    const OwnerSend = (teks) => {
        sock.sendMessage(
            OwnerNumb,
            { text: teks }
        )
    }

    //------------------------------------//
    sock.ev.on('group-participants.update', (anu) => {
        try {
            sock.groupMetadata(anu.id).then((res) => {
                if (anu.participants[0] != '0') {
                    console.log(anu);
                    OwnerSend(`*Action:* ${anu.action} \n*Group:* ${anu.id} \n*Grp Name:* ${res.subject} \n*Participants:* ${anu.participants[0]}`);
                }
            })
        } catch (e) {
            console.log(e)
        }
    })

    sock.ev.on('messages.upsert', async (mek) => {
        const msg = JSON.parse(JSON.stringify(mek)).messages[0];
        // if (mek.type !== 'notify') return;
        // console.log('msg ', msg.message);
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        // console.log('Mek: ', mek.messages[0]);
        const content = JSON.stringify(msg.message);
        const from = msg.key.remoteJid;
        // console.log("From : ", from);
        const type = Object.keys(msg.message)[0];
        // console.log("Type: ", type);
        //----------------------------GET ADMINS-------------------------------//
        const getGroupAdmins = (participants) => {
            admins = [];
            for (let i of participants) {
                ((i.admin == 'admin') || (i.admin == 'superadmin')) ? admins.push(i.id) : "";
            }
            return admins;
        };
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
                        : type == "buttonsResponseMessage"
                            ? msg.message.buttonsResponseMessage.selectedDisplayText
                            : type == "templateButtonReplyMessage"
                                ? msg.message.templateButtonReplyMessage.selectedDisplayText
                                : type == "listResponseMessage"
                                    ? msg.message.listResponseMessage.title
                                    : "";
        //----------------------------------------------------------------------------------------//
        if (body[1] == " ") body = body[0] + body.slice(2);
        // console.log("body : ", body);
        const evv = body.trim().split(/ +/).slice(1).join(' ');
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(prefix);
        const isGroup = from.endsWith("@g.us");
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : " ";
        // console.log("Grp DATA : ", groupMetadata);
        let sender = isGroup ? mek.messages[0].key.participant : mek.messages[0].key.remoteJid;
        const senderNumb = sender.includes(":") ? sender.split(":")[0] : sender.split("@")[0];
        if (msg.key.fromMe) sender = botNumberJid;
        const senderjid = sender.includes(":") ? sender.slice(0, sender.search(":")) + '@' + sender.split("@")[1] : sender;
        //-----------------------------------------------------------------------//
        const groupName = isGroup ? groupMetadata.subject : " ";
        const groupDesc = isGroup ? (groupMetadata.desc == undefined) ? "" : groupMetadata.desc.toString() : "";
        const groupMembers = isGroup ? groupMetadata.participants : " ";
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : " ";
        //-----------------------------------------------------------------------//
        const isBotGroupAdmins = groupAdmins.includes(botNumberJid) || false;
        const isGroupAdmins = groupAdmins.includes(senderjid) || false;
        const SuperAdmin = groupMetadata.owner;
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
            axios.get(`${baseURL}/joke/${categories}?${params}`).then((res) => {
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
        //------------------------NSFW----------------//
        async function getcall(info) {
            await deepai.callStandardApi("nsfw-detector", {
                image: info,
            }).then((res) => {
                let mess = `*Nsfw Score* : ${res.output.nsfw_score}\n`;
                console.log('NSFW Score : ', res.output.nsfw_score);
                if (res.output.detections.length > 0) {
                    for (let i = 0; i < res.output.detections.length; i++) {
                        mess += `*Nsfw* : ${res.output.detections[i].name} : ${res.output.detections[i].confidence}%\n`;
                    }
                    reply(mess);
                } else
                    reply(mess);
            }).catch((res) => {
                console.log("error ", res);
                reply(`*Website error*`);
            });
        }

        //-------------------------COUNT--------------------------------//
        if (isGroup) {
            setCountMember(sender, from, mek.messages[0].pushName);
        }
        //--------------------------------BLOCK-CMDs--------------------//
        let blockCommandsInDesc = []; //commands to be blocked
        if (groupDesc) {
            let firstLineDesc = groupDesc.split("\n")[0];
            blockCommandsInDesc = firstLineDesc.split(",");
        }
        //--------------------------------------------------DM-------------------------------------------------//
        // if (!isGroup)
        //     SendMessageNoReply(`ʜᴇʟʟᴏ \nɪ'ᴍ ʙɪᴛʙᴏᴛ ᴀ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ.\nᴛʏᴘᴇ -ʜᴇʟᴘ`);
        ///////////////////////////////////////////
        //////////////////COMMANDS\\\\\\\\\\\\\\\\\
        ///////////////////////////////////////////
        if (isCmd) {
            //--------------------------------CMDs BLOCK-------------------------//
            if (command != '')
                if (blockCommandsInDesc.includes(command)) {
                    reply("❌ Command blocked for this group!");
                    return;
                }
            //-----------------------BLOCK-USER-----------------------//
            let blockCount = await getBlockWarning(sender);
            if (blockCount == 1) return reply(`You cann't use the bot as u are *blocked*.`);
            // Display every command info
            console.log("[COMMAND]", command, "[FROM]", senderNumb, "[name] " + mek.messages[0].pushName + "[IN]", groupName);
            // Send every command info to Owner
            OwnerSend("[COMMAND] " + command + " [FROM] " + senderNumb + " [name] " + mek.messages[0].pushName + " [IN] " + groupName);
            switch (command) {
                //--------------------------HELP------------------------//
                case 'help':
                    if (!isGroup) SendMessageNoReply(helpDM(prefix));
                    else
                        SendMessageNoReply(userHelp(prefix, groupName));
                    break;
                //--------------------GUI HELP------------------------//
                case 'bit':
                case 'list':
                case 'menu':
                    HelpGUI(sock, from);
                    break;
                //------------------------------ADMIN---------------------------------------//
                case 'admin':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply('```kya matlab tum admin nhi ho 🙄```');
                    SendMessageNoReply(adminList(prefix, groupName));
                    break;
                //------------------------------------OWNER-----------------------------------------//
                case 'owner':
                    if (!OwnerNumb == senderjid) return reply(`Owner Cmd`);
                    SendMessageNoReply(OwnerList(prefix, groupName));
                    break;
                //-------------------------------------ALIVE------------------------------------//
                case 'a':
                case 'alive':
                    if (!isGroup) return;
                    const buttons = [
                        { buttonId: 'id1', buttonText: { displayText: '.help' }, type: 1 }
                    ]
                    const buttonMessage = {
                        text: "```⌊ *Hǝllo*" + mek.messages[0].pushName + " ⌋```",
                        footer: "```🫠🅈🄴🅂 🄸'🄼 🄰🄻🄸🅅🄴🫠```",
                        buttons: buttons,
                        headerType: 1
                    }
                    await sock.sendMessage(from, buttonMessage)
                    // reply("```⌊ *Hǝllo*!! " + + " ⌋\n\n\n🫠🅈🄴🅂 🄸'🄼 🄰🄻🄸🅅🄴🫠```");
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
                //-------------------------------COUNT---------------//
                case "pcount":
                case "count":
                    if (!isGroup) {
                        reply("❌ Group command only!");
                        return;
                    }
                    // if (
                    //     mek.messages[0].message.extendedTextMessage &&
                    //     mek.messages[0].message.extendedTextMessage.contextInfo &&
                    //     mek.messages[0].message.extendedTextMessage.contextInfo.participant
                    // ) {
                    //     sender = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                    // }
                    try {
                        let indiCount = await getCountIndividual(sender, from);
                        if (!indiCount) indiCount = 0;
                        sock.sendMessage(
                            from,
                            {
                                text: `${mek.messages[0].pushName} have _${indiCount} messages from 03 April_ in this group!`
                            }
                        )
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                /* --------------------------------- zero --------------------------------- */
                // case "trash":
                //     try {
                //         if (!isGroup) {
                //             reply("❌ Group command only!");
                //             return;
                //         }
                //         if (allowedNumbs.includes(senderNumb) || isGroupAdmins) {
                //             let resultCountGroupIndi = await getCountGroupMembers(from);
                //             let memWithMsg = new Set();
                //             for (let member of resultCountGroupIndi) {
                //                 memWithMsg.add(member.memberjid);
                //             }
                //             let zeroMsg = `${groupName}\nMembers with 0 message from 03 March:${readMore}\n`;
                //             groupMembers.forEach((mem) => {
                //                 if (!memWithMsg.has(mem.jid)) {
                //                     zeroMsg += `\n${mem.jid.split("@")[0]}`;
                //                 }
                //             });
                //             reply(zeroMsg);
                //         } else {
                //             reply("❌ Admin command!");
                //         }
                //     } catch (err) {
                //         console.log(err);
                //     }
                //     break;
                //--------------------ADVICE------------------------//
                case 'advice':
                    if (!isGroup) return;
                    getRandomAD();
                    break;
                //----------------------TTS-------------------------//
                case 'tts':
                case 'attp':
                    if (!isGroup) return;
                    var take = args[0];
                    for (i = 1; i < args.length; i++) {
                        take += " " + args[i];
                    }
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
                                    sticker: Buffer.from(ttinullimage.data)
                                }
                            );
                        }).catch(() => {
                            reply(`_Daily Api Limit Exceeds_\n_Wait For SomeTime_`);
                        });
                    }
                    getTTS();
                    break;
                //---------------------------MY-NAME--------------------------//
                case 'my':
                    if (!isGroup) return;
                    reply(mek.messages[0].pushName)
                    break;
                //------------------------------MEME----------------------------//
                case 'meme':
                    if (!isGroup) return;
                    reply(`*Sending...*`);
                    const memeURL = 'https://meme-api.herokuapp.com/gimme';
                    await axios.get(`${memeURL}`).then((res) => {
                        console.log("meme ", res.data);
                        let url = res.data.url;
                        if (url.includes("jpg") || url.includes("jpeg") || url.includes("png")) {
                            sock.sendMessage(
                                from,
                                {
                                    image: { url: res.data.url },
                                    caption: `${res.data.title}`
                                },
                                {
                                    quoted: mek.messages[0],
                                }
                            );
                        }
                        else {
                            // downloadmeme(res.data.url).then(() => {
                            // const buffer = fs.readFileSync("./pic.mp4") // load some gif
                            // const options = {
                            //     gifPlayback: true,
                            //     mimetype: Mimetype.gif,
                            //     caption: `${res.data.url}`
                            // } // some metadata & caption
                            sock.sendMessage(
                                from,
                                {
                                    image: { url: res.data.url }
                                },
                                {
                                    gifPlayback: true,
                                    caption: `${res.data.url}`
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
                //-------------------------------TEXT MEME-------------------//
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
                                        caption: 'Send by myBitBot'
                                    },
                                    {
                                        quoted: mek.messages[0],
                                        mimetype: 'image/jpeg'
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
                /* -------------------------------TOIMG------------------------------- */
                case "toimg":
                case "image":
                    if (!isGroup) {
                        reply("❌ Group command only!");
                        return;
                    }
                    if ((isMedia && !mek.messages[0].message.stickerMessage.isAnimated || isTaggedSticker)) {
                        let downloadFilePath;
                        if (mek.messages[0].message.stickerMessage) {
                            downloadFilePath = mek.messages[0].message.stickerMessage;
                        } else {
                            downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
                        }
                        const stream = await downloadContentFromMessage(downloadFilePath, 'image');
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const media = getRandom('.jpeg');
                        await writeFile(media, buffer)
                        ffmpeg(`./${media}`)
                            .fromFormat("webp_pipe")
                            .save("result.png")
                            .on("error", (err) => {
                                console.log(err);
                                reply(
                                    "❌ There is some problem!\nOnly non-animated stickers can be convert to image!"
                                );
                            })
                            .on("end", () => {
                                sock.sendMessage(
                                    from,
                                    {
                                        image: fs.readFileSync("result.png"),
                                        caption: 'Send by myBitBot'
                                    },
                                    {
                                        mimetype: 'image/png',
                                        quoted: mek.messages[0],
                                    }
                                );
                                fs.unlinkSync("result.png");
                                fs.unlinkSync(media);
                            });
                    } else {
                        reply(
                            "❌ There is some problem!\nOnly non-animated stickers can be convert to image!"
                        );
                    }
                    break;
                //---------------------JOKE----------------------------//
                case 'joke':
                    if (!isGroup) return;
                    if (!args[0]) args[0] = 'any';
                    jokeFun(args[0].slice(0, 1).toUpperCase() + args[0].slice(1));
                    // console.log(args[0].slice(0,1).toUpperCase() + args[0].slice(1));
                    break;
                //---------------------------------REMOVE_BG--------------------//
                case 'removebg':
                    if (!isGroup) return;
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
                        reply(`*Removing Background....*`);
                        getRemoveBg(media).then(() => {
                            sock.sendMessage(
                                from,
                                {
                                    image: fs.readFileSync("./bg.png"),
                                    mimetype: 'image/png',
                                    caption: `*Removed!!*`
                                },
                                {
                                    quoted: mek.messages[0]
                                }
                            )
                            fs.unlinkSync("./bg.png");
                            fs.unlinkSync(media);
                        }).catch((err) => {
                            OwnerSend('*RemoveBG ERROR :* ' + err)
                            console.log('Status : ', err.status);
                            reply(`Website Error, Tag Owner or Mod : \n Need to change api key.`)
                        });
                    } else {
                        reply(`*Reply to image only*`);
                    }
                    break;
                //----------------------------ANIME---------------------------/
                case 'anime':
                    if (!isGroup) return;
                    var name = content;
                    OwnerSend("Args : " + name);
                    if (name.includes('name') || name.includes('char')) {
                        getAnimeRandom('quotes/character?name=' + name.toLowerCase().substring(4).trim().split(" ").join("+")).then((message) => {
                            reply(message);
                        }).catch((error) => {
                            reply(error);
                        });
                    } else if (name.includes('title')) {
                        mess = getAnimeRandom('quotes/anime?title=' + name.toLowerCase().substring(6).trim().split(" ").join("%20")).then((message) => {
                            reply(message);
                        }).catch((error) => {
                            reply(error);
                        });
                    } else {
                        getAnimeRandom('random').then((message) => {
                            reply(message);
                        }).catch((error) => {
                            reply(error);
                        })
                    }
                    break;
                //-----------------------setDmtoZero-------------------//
                case 'reset':
                    if (OwnerNumb != sender) return;
                    if (mek.messages[0].message.extendedTextMessage) {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        setCountDMOwner(taggedJid);
                        reply(`Reset Limit for that User`);
                    } else if (args[0] == 'all' || args[0] == 'All') {
                        removeCountDM();
                        reply(`*Reset Dm Limit*`);
                    } else {
                        reply(`Reply to send reset all`);
                    }
                    break;

                //-------------------GetCountDm-----------------------//
                case 'limit':
                    if (OwnerNumb == sender) {
                        if (mek.messages[0].message.extendedTextMessage) {
                            let taggedJid;
                            if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                                taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                            } else {
                                taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                            }
                            console.log('Tag : ', taggedJid);
                            (async () => {
                                const getDmCount = await getCountDM(taggedJid);
                                reply(`*Monthly Limit* : ${getDmCount}/100`);
                            })();
                        }
                    } else {
                        (async () => {
                            const getDmCount = await getCountDM(sender);
                            reply(`*Your Monthly Limit* : ${getDmCount}/100`);
                        })();
                    }
                    break;
                //----------------------------STICKER--------------------------------------//
                case 'sticker':
                case 's':
                    if (!isGroup) {
                        await setCountDM(sender);
                        if (getCountDM(sender) >= 100) {
                            return reply('You have used your monthly limit.\nWait for next month.')
                        }
                        else {
                            (async () => {
                                const getDmCount = await getCountDM(sender);
                                SendMessageNoReply(`*Limit Left* : ${getDmCount}/100`);
                            })();
                        }
                    }
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
                        packName = "Bit"
                    }
                    if (authorName == "") {
                        authorName = "Bot"
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
                        await writeFile(media, buffer);
                        (async () => {
                            reply('⌛Changing media to sticker⏳')//⌛Ruk Bhai..Kar raha ⏳
                            const sticker1 = new Sticker(media, {
                                pack: packName, // The pack name
                                author: authorName, // The author name
                                type: (args.includes('crop') || (args.includes("c"))) ? StickerTypes.CROPPED : args.includes("cc") ? StickerTypes.CIRCLE : StickerTypes.FULL,
                                quality: 100,
                            })
                            const saveSticker = getRandom('.webp')
                            await sticker1.toFile(saveSticker)
                            await sock.sendMessage(
                                from,
                                {
                                    sticker: fs.readFileSync(saveSticker)
                                }
                            )
                            fs.unlinkSync(media);
                            fs.unlinkSync(saveSticker)
                        })();
                    } else if ((isMedia && mek.messages[0].message.videoMessage.seconds < 11 || isTaggedVideo && mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) {
                        let downloadFilePath;
                        if (mek.messages[0].message.videoMessage) {
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
                        await writeFile(media, buffer);
                        (async () => {
                            reply('⌛Changing media file to Sticker⏳')//⌛ Ho raha Thoda wait karle... ⏳
                            const sticker1 = new Sticker(media, {
                                pack: packName, // The pack name
                                author: authorName, // The author name
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
                    break;
                //----------------------------STEAL------------------------------//
                case 'steal':
                    if (!isGroup) return;
                    try {
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
                            packName = "Bit"
                        }
                        if (authorName == "") {
                            authorName = "Bot"
                        }
                        if ((isTaggedSticker)) {
                            let downloadFilePath;
                            downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
                            const stream = await downloadContentFromMessage(downloadFilePath, 'sticker');
                            let buffer = Buffer.from([])
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk])
                            }
                            const media = getRandom('.webp');
                            await writeFile(media, buffer);
                            (async () => {
                                const sticker1 = new Sticker(media, {
                                    pack: packName, // The pack name
                                    author: authorName, // The author name
                                    type: StickerTypes.DEFAULT,
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
                                fs.unlinkSync(media);
                                fs.unlinkSync(saveSticker)
                            })();
                        } else {
                            reply(`*Reply To Sticker Only*`);
                        }
                    } catch (err) {
                        console.log(err);
                        reply("Error.")
                    }
                    break;
                //-------------------------------INSTA------------------------------//
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
                            for (let i = 0; i < res.media_count; i++) {
                                if (res.links[i].type == "video") {
                                    sock.sendMessage(
                                        from,
                                        {
                                            video: { url: res.links[i].url }
                                        },
                                        { quoted: mek.messages[i] }
                                    )
                                } else if (res.links[i].type == "image") {
                                    sock.sendMessage(
                                        from,
                                        {
                                            image: { url: res.links[i].url }
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
                //--------------------FB--------------------------------//
                case 'fb':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`*Enter fb link after ${prefix}fb <link>*`);
                    console.log(args[0]);
                    OwnerSend('Fb : ' + args[0])
                    try {
                        (async () => {
                            let FBurl;
                            await axios(args[0]).then((response) => {
                                FBurl = response.request._redirectable._currentUrl
                            }).then(() => {
                                (async () => {
                                    const res = await Facebook.getVideo(`${FBurl}`);
                                    if (res.data.hasError == false) {
                                        reply(`*Downloading Pls wait...*`)
                                        if (res.data.body.videoHD) {
                                            sock.sendMessage(
                                                from,
                                                {
                                                    video: { url: res.data.body.videoHD },
                                                    caption: 'Send by myBitBot'
                                                },
                                                {
                                                    quoted: mek.messages[0]
                                                }
                                            )
                                        } else {
                                            sock.sendMessage(
                                                from,
                                                {
                                                    video: { url: res.data.body.video },
                                                    caption: 'Send by myBitBot'
                                                },
                                                {
                                                    quoted: mek.messages[0]
                                                }
                                            )
                                        }
                                    } else if (res.data.hasError == true) {
                                        reply(res.data.errorMessage)
                                    }
                                })();
                            });
                        })();
                    } catch (err) {
                        console.log('Fb Err : ', err, res.data.errorDescription);
                        reply(`Api Error Tag Mod to let him know`)
                    }
                    break;
                //------------------------------TWITTER--------------------//
                case 'twitter':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`Enter twitter  video link only after ${prefix}twitter <link>`);
                    const twitterURL = args[0];
                    try {
                        (async () => {
                            const res = Twitter.getVideo(twitterURL);
                            if (res.data.hasError == false) {
                                sock.sendMessage(
                                    form,
                                    {
                                        video: { url: res.data.body.video },
                                        caption: 'Send by myBitBot'
                                    },
                                    {
                                        quoted: mek.messages[0]
                                    }
                                )
                            } else {
                                reply(res.data.errorMessage);
                            }
                        })
                    } catch (err) {
                        console.log('Twitter Err : ', err, res.data.errorDescription);
                        reply(`Api Error Tag Mod to let him know`);
                    }
                    break;
                //---------------------------------MOIVE--------------------//
                case 'movie':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`Provide Movie name.`);
                    let movie = body.trim().split(/ +/).slice(1).join('+');
                    OwnerSend("Movie : " + movie);
                    let MovieUrl = '';
                    await downloadAll('`' + movie).then((message) => {
                        MovieUrl += message + "\n\n";
                    }).catch(() => { });
                    await downloadbolly('`' + movie).then((message) => {
                        MovieUrl += message + "\n\n";
                    }).catch(() => { });
                    await downloadholly('`' + movie).then((message) => {
                        MovieUrl += message + "\n\n";
                    }).catch(() => { });
                    if (MovieUrl != '')
                        reply(`*Direct link for*😊 ${movie.split("+").join(" ")}\n\n` + MovieUrl);
                    else {
                        console.log("Not Found!!");
                        reply(`*Sorry* No Movie Found\nCheck your _spelling or try another movie_.`);
                    }
                    break;
                //--------------------------NSFW-------------------------------//
                case 'nsfw':
                    if (!isGroup) return;
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
                        deepai.setApiKey(deepAI);
                        getcall(buffer)
                    }
                    else {
                        reply(`*Reply to image only*`);
                        console.log("Error not replyed");
                    }
                    break;
                //--------------------------UD---------------------------//
                case 'ud':
                    if (!isGroup) return;
                    try {
                        let result = await ud.define(args[0])
                        let term = result[0].word;
                        let def = result[0].definition;
                        let example = result[0].example;
                        reply(`*Term*: ${term} 
  *Definition*: ${def}
  *Example*: ${example}`);
                    }
                    catch {
                        reply("🙇‍♂️ Sorry to say but this word/creature does not exist")
                    }
                    break;
                //-----------------------------------EMOJI-TO-STICKER------------------------------//
                case 'pmoji':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`❌ Enter emoji after pmoji`);
                    OwnerSend('Args: ' + content);
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
                //----------------------------IDP------------------------//
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
                                    caption: `${prof}`
                                },
                                {
                                    quoted: mek.messages[0]
                                }
                            )
                        }).catch((error) => {
                            console.log(error);
                            reply(`_Bad Luck_ :(\nGetting login page!!`);
                        })
                    }
                    idp(prof);
                    break;
                //-------------------------FACT---------------------//
                case 'fact':
                    if (!isGroup) return;
                    getFact().then((message) => {
                        reply(`✍️(◔◡◔) *Amazing Fact* \n\n` + message);
                    }).catch((Error) => {
                        reply("Error");
                    })
                    break;
                //---------------------------HORO------------------//
                case 'horo':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`Enter your horoscope.`)
                    console.log("SENDER NUMB:", senderNumb);
                    let horoscope = args[0];
                    let h_Low = horoscope.toLowerCase();
                    let l = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
                    if (!l.includes(h_Low)) {
                        reply("Kindly enter the right spelling ")//SAhi se daal bhai,sign 12 he hote hai :)       
                    } else {
                        const callhoro = await gethoro(h_Low);
                        reply(` *Date Range*:-${callhoro.date_range}
 *Nature Hold's For you*:-${callhoro.description}
 *Compatibility*:-${callhoro.compatibility}
 *Mood*:-${callhoro.mood}
 *color*:-${callhoro.color}
 *Lucky Number*:-${callhoro.lucky_number}
 *Lucky time*:-${callhoro.lucky_time}`)
                    }
                    break;
                /* ------------------------------- CASE: GENDER ------------------------------ */
                case "gender":
                    if (!isGroup) {
                        reply("❌ Group command only!");
                        return;
                    }
                    if (args.length === 0) {
                        reply(`❌ Name is not given! \nSend ${prefix}gender firstname`);
                        return;
                    }
                    let namePerson = args[0];
                    if (namePerson.includes("@")) {
                        reply(`❌ Don't tag! \nSend ${prefix}gender firstname`);
                        return;
                    }
                    console.log('Name : ', namePerson);
                    getGender(namePerson).then((message) => {
                        reply(message);
                    }).catch((error) => {
                        reply(error);
                    });
                    break;
                //------------------------------MP3------------------------------//
                case 'mp3':
                case 'mp4audio':
                case 'tomp3':
                    if (!isGroup) return;
                    if ((isMedia && !mek.messages[0].message.imageMessage || isTaggedVideo)) {
                        let downloadFilePath;
                        if (mek.messages[0].message.videoMessage) {
                            downloadFilePath = mek.messages[0].message.videoMessage;
                        } else {
                            downloadFilePath = mek.messages[0].message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
                        }
                        const stream = await downloadContentFromMessage(downloadFilePath, 'video');
                        let buffer = Buffer.from([])
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk])
                        }
                        const media = getRandom('.mp4')
                        await writeFile(media, buffer)
                        const path = getRandom('.mp3');
                        function convert(input, output, callback) {
                            ffmpeg(input)
                                .output(output)
                                .on('end', function () {
                                    console.log('conversion ended');
                                    callback(null);
                                }).on('error', function (err) {
                                    console.log('error: ', e.code, e.msg);
                                    callback(err);
                                }).run();
                        }
                        convert(media, path, function (err) {
                            if (!err) {
                                console.log('conversion complete');
                                (async () => {
                                    await sock.sendMessage(
                                        from,
                                        {
                                            audio: fs.readFileSync(path),
                                            mimetype: 'audio/mp4'
                                        },
                                        {
                                            quoted: mek.messages[0]
                                        }
                                    )
                                })();
                            }
                        });
                    }
                    else {
                        console.log("No Media tag");
                        reply(`*Reply to video only*`)
                    }
                    break;
                //---------------------------------JID---------------------------------//
                case 'jid':
                    if (!allowedNumbs.includes(senderNumb)) return;
                    reply(from);
                    break;
                /* ------------------------------- CASE: DELETE ------------------------------ */
                case "delete":
                case "d":
                case 'del':
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
                //-------------------------YT--------------------------//
                case 'yt':
                case 'ytv':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`Type url after ${prefix}yt`);
                    var YTurl = args[0];
                    console.log(`${YTurl}`);
                    OwnerSend('Yt : ' + YTurl)
                    try {
                        (async () => {
                            const resV = await YouTube.getVideo(YTurl);
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
                                                quoted: mek.messages[0]
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
                                                quoted: mek.messages[0]
                                            }
                                        )
                                    } catch {
                                        reply('No 360p Found')
                                    }
                                }
                            }
                        })();
                    } catch (error) {
                        console.log(error);
                        reply(`Unable to download,contact dev.`);
                    }
                    break;
                //------------------------------YTA-------------------------//
                case 'yta':
                    if (!isGroup) return;
                    if (!args[0]) return reply(`_Enter URl after yta_`);
                    var url1 = args[0];
                    console.log(`${url1}`)
                    const am = async (url1) => {
                        let info = ytdl.getInfo(url1)
                        let sany = getRandom('.mp3')
                        const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                            .pipe(fs.createWriteStream(sany));
                        console.log("audio downloaded")
                        reply('*Downloading Audio.....*\nThis may take upto 1 or 2 min.');
                        await new Promise((resolve, reject) => {
                            stream.on('error', reject)
                            stream.on('finish', resolve)
                        }).then(async (res) => {
                            await sock.sendMessage(
                                from,
                                {
                                    audio: fs.readFileSync(sany)
                                },
                                {
                                    quoted: mek.messages[0]
                                }
                            ).then((resolved) => {
                                console.log("Sent ")
                                fs.unlinkSync(sany)
                            }).catch((reject) => {
                                reply('Audio Not Found or unable to download.')
                            })
                        }).catch((err) => {
                            reply`Unable to download,contact dev.`;
                        });
                    }
                    am(url1)
                    break;
                /* ------------------------------- CASE: SONG ------------------------------ */
                case "song":
                    if (!isGroup) {
                        reply("❌ Group command only!");
                        return;
                    }
                    if (args.length === 0) {
                        reply(`❌ Query is empty! \nSend ${prefix}song query`);
                        return;
                    }
                    let uname = args;
                    const sonurl = await findSong(uname);
                    console.log(sonurl);
                    const gm = async (url1) => {
                        let info = ytdl.getInfo(url1)
                        let sany = getRandom('.mp3')
                        reply(`_Downloading Song.._\nThis may take upto 1 to 2 min.`);
                        const stream = ytdl(url1, { filter: info => info.audioBitrate == 160 || info.audioBitrate == 128 })
                            .pipe(fs.createWriteStream(sany));
                        console.log("Audio downloaded")
                        await new Promise((resolve, reject) => {
                            stream.on('error', reject)
                            stream.on('finish', resolve)
                        }).then(async (res) => {
                            await sock.sendMessage(
                                from,
                                {
                                    audio: fs.readFileSync(sany),
                                },
                                {
                                    quoted: mek.messages[0]
                                }
                            ).then((resolved) => {
                                console.log("Sent")
                                fs.unlinkSync(sany)
                            }).catch((reject) => {
                                reply(`_Enable to download send a valid req_`);
                            })
                        }).catch((err) => {
                            reply(`_Unable to download,contact dev_.`);
                        });
                    }
                    gm(sonurl)
                    break;
                //------------------------SOURCE------------------------//
                case 'dev':
                case 'devloper':
                case 'source':
                    const templateButtons = [
                        { index: 1, urlButton: { displayText: '⭐ Project Link!', url: 'https://github.com/jacktheboss220/MyBitBot-MD' } },
                        { index: 2, urlButton: { displayText: 'Contact Me!', url: 'https://github.com/jacktheboss220/MyBitBot-MD/issues' } },
                        { index: 3, quickReplyButton: { displayText: '.source', id: 'id1' } }
                    ]
                    const templateMessage = {
                        text: "ɢɪᴠᴇ ᴀ ꜱᴛᴀʀ ɪꜰ ʏᴏᴜ ʟɪᴋᴇ ᴛʜᴇ ʙᴏᴛ\nꜰᴏᴜɴᴅ ᴀ ʙᴜɢ ᴏʀ ᴇʀʀᴏʀ ᴄᴏɴᴛᴀᴄᴛ ᴍᴇ ʙᴇʟᴏᴡ",
                        footer: 'ᴮᴵᵀᴮᴼᵀ',
                        templateButtons: templateButtons
                    }
                    await sock.sendMessage(from, templateMessage);
                    break;
                ///////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
                ////////////////////ADMIN\\\\\\\\\\\\\\\\\\\\\\
                ///////////////////////////////////////////////
                //------------------------ADD-----------------------------//
                case 'add':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ Kya lagta hai mai bina admin powers ke add kar sakta hm?`);
                    let taggedJid;
                    if (mek.messages[0].message.extendedTextMessage) {
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant)
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        try {
                            await sock.groupParticipantsUpdate(
                                from,
                                [taggedJid],
                                "add"
                            )
                        } catch (err) {
                            console.log('error', err);
                        }
                    }
                    else {
                        if (!args[0]) return reply(`❌ give number or tag on message`);
                        if (args[0].startsWith("+")) args[0].slice(1);
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
                //----------------------------GROUP-LINK---------------------------------//
                case 'link':
                case 'getlink':
                case 'grouplink':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) return reply(`❌ kya matlab tum admin nhi ho 🙄`);
                    if (!isBotGroupAdmins) return reply(`❌ kya lagta hai mai bina admin powers ke link de sakta hm?`);
                    const gc_invite_code = await sock.groupInviteCode(from)
                    gc_link = `https://chat.whatsapp.com/${gc_invite_code}`
                    sock.sendMessage(
                        from,
                        { text: gc_link },
                        {
                            quoted: mek.messages[0]
                        }
                    )
                    break;
                //------------------------------CAHT-ON-OFF------------------------//
                case 'chat':
                    if (!isGroup) return;
                    if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) {
                        reply("❌ kya matlab tum admin nhi ho 🙄");
                        return;
                    }
                    if (!isBotGroupAdmins) return reply(`❌ kya lagta hai mai bina admin powers ke chat on off kar sakta hm?`);
                    if (args.length < 1) return reply(`❌ Kya karna On ya Off likho to`);
                    if (args[0] == 'off') {
                        sock.groupSettingUpdate(from, 'announcement');
                        reply(`✔️ *Only Admin can send Message*`);
                    } else if (args[0] == 'on') {
                        sock.groupSettingUpdate(from, 'not_announcement');
                        reply(`✔️ *Allowed all member can send Message*`);
                    } else {
                        return;
                    }
                    break;
                //--------------------------------BLOCK---------------------------//
                case 'block':
                    if (!mek.messages[0].message.extendedTextMessage) {
                        reply("❌ Tag someone!");
                        return;
                    }
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        //when member are mentioned with command
                        OwnerSend("Target : " + taggedJid);
                        if (taggedJid == botNumberJid) return reply(`*Baka* How I can _Block_ Myself.😂`);
                        if (allowedNumbs.includes(taggedJid.split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\n Oh Trying to Block Owner or Moderator 😊 *Baka*`);
                        if (!(allowedNumbs.includes(senderNumb))) {
                            reply("❌ Owner command!");
                            return;
                        }
                        console.log('tag: ', taggedJid);
                        let num_split = taggedJid.split("@s.whatsapp.net")[0];
                        await setBlockWarning(taggedJid);
                        let warnMsg = `@${num_split} ,You have been Block To Use the Bot. Ask Owner or Mod to remove it.`;
                        sock.sendMessage(
                            from,
                            {
                                text: warnMsg,
                                mentions: [taggedJid]
                            }
                        )
                        reply(`*👍Done Commands Blocked For The Number.*`);
                    } catch (err) {
                        OwnerSend(err);
                        reply(`❌ Error!`);
                    }
                    break;

                case 'unblock':
                    if (!(allowedNumbs.includes(senderNumb))) {
                        reply("❌ Owner command!");
                        return;
                    }
                    if (!mek.messages[0].message.extendedTextMessage) {
                        reply("❌ Tag someone!");
                        return;
                    }
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        //when member are mentioned with command
                        await removeBlockWarning(taggedJid);
                        reply(`*👍Done Commands Unblocked For The Number.*`);
                    } catch (err) {
                        OwnerSend(err);
                        reply(`❌ Error!`);
                    }
                    break;
                //------------------------WARNING-----------------------------//
                case 'getwarn':
                    if (!mek.messages[0].message.extendedTextMessage) {
                        reply("❌ Tag someone! or want to know your count reply on your message");
                        return;
                    }
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        OwnerSend("Target : " + taggedJid);
                        let warnCount = await getCountWarning(taggedJid, from);
                        let num_split = taggedJid.split("@s.whatsapp.net")[0];
                        let warnMsg = `@${num_split}, Your warning status is (${warnCount}/3) in this group.`;
                        sock.sendMessage(
                            from,
                            {
                                text: warnMsg,
                                mentions: [taggedJid]
                            }
                        )
                    } catch (error) {
                        OwnerSend(error);
                    }
                    break;

                case 'warn':
                    if (!mek.messages[0].message.extendedTextMessage) {
                        reply("❌ Tag someone!");
                        return;
                    }
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        OwnerSend("Target : " + taggedJid);
                        if (taggedJid == botNumberJid) return reply(`*Baka* How I can _Warn_ Myself.😂`);
                        if (allowedNumbs.includes(taggedJid.split('@')[0])) return reply(`🙄 *Something Not Right* 🙄\n Oh Trying to Warn Owner or Moderator 😊 *Baka*`);
                        if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) {
                            reply("❌ kya matlab tum admin nhi ho 🙄");
                            return;
                        }
                        let warnCount = await getCountWarning(taggedJid, from);
                        let num_split = taggedJid.split("@s.whatsapp.net")[0];
                        let warnMsg = `@${num_split} 😒,You have been warned. Warning status (${warnCount + 1
                            }/3). Don't repeat this type of behaviour again or you'll be banned 😔 from the group!`;
                        sock.sendMessage(
                            from,
                            {
                                text: warnMsg,
                                mentions: [taggedJid]
                            }
                        )
                        await setCountWarning(taggedJid, from);
                        if (warnCount >= 2) {
                            if (!isBotGroupAdmins) {
                                reply("❌ I'm not Admin here!");
                                return;
                            }
                            if (groupAdmins.includes(taggedJid)) {
                                reply("❌ Cannot remove admin!");
                                return;
                            }
                            sock.groupParticipantsUpdate(
                                from,
                                [taggedJid],
                                "remove"
                            )
                            reply("✔ Number removed from group!");
                        }
                    } catch (err) {
                        OwnerSend(`Error`);
                        console.log(err);
                        reply(`❌ Error!`);
                    }
                    break;

                case 'unwarn':
                    if (!(allowedNumbs.includes(senderNumb))) {
                        reply("❌ Owner command!");
                        return;
                    }
                    if (!mek.messages[0].message.extendedTextMessage) {
                        reply("❌ Tag someone!");
                        return;
                    }
                    try {
                        let taggedJid;
                        if (mek.messages[0].message.extendedTextMessage.contextInfo.participant) {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.participant;
                        } else {
                            taggedJid = mek.messages[0].message.extendedTextMessage.contextInfo.mentionedJid[0];
                        }
                        if (!isGroupAdmins && !allowedNumbs.includes(senderNumb)) {
                            reply("❌ kya matlab tum admin nhi ho 🙄");
                            return;
                        }
                        await removeWarnCount(taggedJid, from);
                        reply(`Set Warn Count to 0 for this user.`);
                    } catch (err) {
                        OwnerSend(err);
                        reply(`❌ Error!`);
                    }
                    break;
                //----------------------SPAM-------------------------------//
                case 'spam':
                    if (!isGroup) return;
                    if (args.length < 2) return reply(`give message and repeat fields.`);
                    OwnerSend('Args : ' + args);
                    if (Number(args[0]) > 100) return reply(`Too much value`);
                    if (!allowedNumbs.includes(senderNumb)) return reply(`Kya matlab u no Mod.`);
                    let mess = '';
                    for (let i = 1; i <= args.length - 1; i++) {
                        mess += args[i];
                    }
                    for (let i = 1; i <= args[0]; i++) {
                        SendMessageNoReply(mess);
                    }
                    break;
                default:
                    //----------------------------------------------------------------------------------------------------//
                    if (isGroup)
                        reply(`*Wrong Command or Tag Mod To let him know this command is not added*`);
            }
        }
    })
}
startSock()
