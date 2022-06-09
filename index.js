/**
* @author jacktheboss220 <mahesh.kumar.mk.0229@gmail.com>
* @link https://www.github.com/jacktheboss220
* @version 1.1.0
* @file  index.js - all commands and login data
* @description WhatsApp Bot written in Baileys version with database linked to store the login data
*/

require('dotenv').config() // loading env vaiables

//----------------------------------Baileys----------------------------------------------//
const {
    default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState,
    downloadMediaMessage,
    fetchLatestBaileysVersion,
} = require("@adiwajshing/baileys");


// ---------------------------------SERVER-------------------------------------------- //
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("Bot is running.. :)");
});
app.listen(port, () => {
    // console.clear();
    console.log("\nWeb-server running!\n");
});


//----------------------------------------------------------------------------//

const P = require("pino");
let MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = 'warn';


//--------------------------------------AUTH-FILE--------------------------------//
const fs = require("fs");
try {
    fs.unlinkSync("./auth_info_multi.json");
} catch (err) {
    console.log("File Already Deleted");
}

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");

// start a connection
// console.log('state : ', state.creds);

//------------------------------------------------------------------------------//
//--------------------------------------DATABASE--------------------------------//

const db = require('./database');

//------------------------------------------------------------------------------//
//--------------------------------AUTH-FETCH------------------------------------//

let cred, auth_row_count;
async function fetchauth() {
    try {
        auth_result = await db.query('select * from auth;');//checking auth table
        console.log('Fetching login data...')
        auth_row_count = await auth_result.rowCount;
        let data = auth_result.rows[0];
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
                    lastAccountSyncTimestamp: 0, // remove the last timeStamp from db
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

//---------------------------Sticker Forword Modules--------------------------------//
// const { Sticker, StickerTypes } = require('wa-sticker-formatter');
// const getRandom = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };

//-------------------------- Extra package include & const--------------------------//
const MyBotGrp = '918318585418-1614183205@g.us';
const { getCmdToBlock } = require('./DB/cmdBlockDB') //block cmd module
const { getBlockWarning } = require('./DB/blockDB') //block module 
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const allowedNumbs = ["918318585418"];
const util = require("util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let commandsPublic = {};
let commandsMembers = {};
let commandsAdmins = {};
let commandsOwners = {};

const prefix = "-";
// const prefix = ".";

const addCommands = async () => {
    let path = "./commands/public/";
    let filenames = await readdir(path);
    filenames.forEach((file) => {
        if (file.endsWith(".js")) {
            let { command } = require(path + file);
            let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
            // console.log(cmdinfo.cmd);
            for (let c of cmdinfo.cmd) {
                commandsPublic[c] = cmdinfo.handler;
            }
        }
    });

    path = "./commands/group/members/";
    filenames = await readdir(path);
    filenames.forEach((file) => {
        if (file.endsWith(".js")) {
            let { command } = require(path + file);
            let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
            // console.log(cmdinfo.cmd);
            for (let c of cmdinfo.cmd) {
                commandsMembers[c] = cmdinfo.handler;
            }
        }
    });

    path = "./commands/group/admins/";
    filenames = await readdir(path);
    filenames.forEach((file) => {
        if (file.endsWith(".js")) {
            let { command } = require(path + file);
            let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
            // console.log(cmdinfo.cmd);
            for (let c of cmdinfo.cmd) {
                commandsAdmins[c] = cmdinfo.handler;
            }
        }
    });

    path = "./commands/owner/";
    filenames = await readdir(path);
    filenames.forEach((file) => {
        if (file.endsWith(".js")) {
            let { command } = require(path + file);
            let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
            // console.log(cmdinfo.cmd);
            for (let c of cmdinfo.cmd) {
                commandsOwners[c] = cmdinfo.handler;
            }
        }
    });

    //deleting the files .webp .jpeg .jpg .mp3 .mp4 .png
    path = "./";
    filenames = await readdir(path);
    filenames.forEach((file) => {
        if (file.endsWith(".webp") || file.endsWith(".jpeg") || file.endsWith(".mp3") || file.endsWith(".mp4") || file.endsWith(".jpg") || file.endsWith(".png")) {
            fs.unlinkSync(path + file);
        }
    });

};


//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//
//-------------------------------MAIN-FUNTION-------------------------------------//
//--------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------//

const startSock = async () => {
    addCommands();
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
    let noLogs = P({ level: "silent" }); //to hide the chat logs
    await fetchauth();
    if (auth_row_count == 0);
    else {
        state.creds = cred.creds;
    }
    const sock = makeWASocket({
        version,
        logger: noLogs,
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: true,
        auth: state,
    });

    //-------------------------OWNER-SEND------------------------------------//
    const OwnerSend = (teks) => {
        sock.sendMessage(
            myNumber,
            { text: teks }
        )
    }
    //-----------------------------------------------------------------------//

    //---------------------------------------group-participants.update-----------------------------------------//
    sock.ev.on('group-participants.update', (anu) => {
        try {
            sock.groupMetadata(anu.id).then((res) => {
                OwnerSend(`*Action:* ${anu.action} \n*Group:* ${anu.id} \n*Grp Name:* ${res.subject} \n*Participants:* ${anu.participants[0]}`);
            })
            console.log(anu);
        } catch (e) {
            console.log(e)
        }
    });
    //--------------------------------------------------------------------------------------------------------------//
    //---------------------------------------messages.upsert---------------//
    sock.ev.on("messages.upsert", async (mek) => {
        try {
            const msg = JSON.parse(JSON.stringify(mek)).messages[0];

            if (!msg.message) return;//when demote, add, remove, etc happen then msg.message is not there

            // if (msg.key.fromMe) return;
            // console.log('Mek: ',mek.messages);

            const content = JSON.stringify(msg.message);
            const from = msg.key.remoteJid;
            const type = Object.keys(msg.message)[0];

            // if (from == MyBotGrp && mek.messages[0].message.stickerMessage) {
            //     const buffer = await downloadMediaMessage(
            //         mek.messages[0],
            //         'buffer',
            //         {},
            //     );
            //     const sticker = new Sticker(buffer, {
            //         pack: 'myBitBot',
            //         author: 'MD',
            //         type: StickerTypes.DEFAULT,
            //     });
            //     const saveSticker = getRandom('.webp');
            //     await sticker.toFile(saveSticker);
            //     sock.sendMessage(
            //         '917887499710-1627237107@g.us',
            //         {
            //             sticker: fs.readFileSync(saveSticker)
            //         }
            //     ).then(() => {
            //         try {
            //             fs.unlinkSync(saveSticker);
            //         } catch { }
            //     });
            // }
            // console.log("Type: ", type);
            //-------------------------------reply-------------------//
            const reply = (take) => {
                sock.sendMessage(
                    from,
                    { text: take },
                    { quoted: mek.messages[0] }
                )
            }
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
            let body = type === "conversation" && msg.message.conversation.startsWith(prefix)
                ? msg.message.conversation : type == "imageMessage" &&
                    msg.message.imageMessage.caption &&
                    msg.message.imageMessage.caption.startsWith(prefix)
                    ? msg.message.imageMessage.caption : type == "videoMessage" &&
                        msg.message.videoMessage.caption &&
                        msg.message.videoMessage.caption.startsWith(prefix)
                        ? msg.message.videoMessage.caption : type == "extendedTextMessage" &&
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
            const evv = body.trim().split(/ +/).slice(1).join(' ');
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
            const args = body.trim().split(/ +/).slice(1);
            const isCmd = body.startsWith(prefix);
            const isGroup = from.endsWith("@g.us");

            if (!isCmd) return;
            //-------------------Read-Seen-------------------------------------//
            const readkey = {
                remoteJid: from,
                id: mek.messages[0].key.id, // id of the message you want to read
                participant: isGroup ? mek.messages[0].key.participant : undefined // the ID of the user that sent the  message (undefined for individual chats)
            }
            await sock.readMessages([readkey]);


            const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
            // console.log("Grp DATA : ", groupMetadata.desc.toString());
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
            const isGroupAdmin = groupAdmins.includes(senderjid) || false;

            const isMedia
                = type === "imageMessage" || type === "videoMessage";
            const isTaggedImage
                = type === "extendedTextMessage" && content.includes("imageMessage");
            const isTaggedVideo
                = type === "extendedTextMessage" && content.includes("videoMessage");
            const isTaggedSticker
                = type === "extendedTextMessage" && content.includes("stickerMessage");
            const isTaggedDocument
                = type === "extendedTextMessage" && content.includes("documentMessage");

            // Display every command info
            console.log(
                "[COMMAND]",
                command,
                "[FROM]",
                senderNumb,
                "[name]",
                mek.messages[0].pushName,
                "[IN]",
                groupName
            );

            // Send every command info to Owner
            OwnerSend("[COMMAND] " + command + " [FROM] " + senderNumb + " [name] " + mek.messages[0].pushName + " [IN] " + groupName);

            //-----------------------BLOCK-USER-----------------------//
            let blockCount = await getBlockWarning(sender);
            if (blockCount == 1) return;

            //--------------------------BLOCK-CMDs--------------------//
            let blockCommandsInDesc = []; //commands to be blocked
            if (groupDesc) {
                let firstLineDesc = groupDesc.toString().split("\n")[0];
                blockCommandsInDesc = firstLineDesc.split(",");
            }

            var resBlock = await getCmdToBlock(from);
            let blockCommandsInDB = resBlock.toString().split(",");

            //----------------------------------------------------------//

            const msgInfoObj = {
                prefix,
                evv,
                sender,
                senderjid,
                command,
                groupMetadata,
                isGroup,
                isGroupAdmin,
                isBotGroupAdmins,
                isMedia,
                isTaggedImage,
                isTaggedVideo,
                isTaggedSticker,
                isTaggedDocument,
                botNumberJid,
            }


            ///////////////////////////////////////////
            //////////////////COMMANDS\\\\\\\\\\\\\\\\\
            ///////////////////////////////////////////

            if (command != '') {
                if (blockCommandsInDesc.includes(command) || (blockCommandsInDB.includes(command))) {
                    // if (blockCommandsInDesc.includes(command)) {
                    reply("❌ Command blocked for this group!");
                    return;
                }
            }

            /* ----------------------------- public commands ---------------------------- */
            if (commandsPublic[command]) {
                commandsPublic[command](sock, mek.messages[0], from, args, msgInfoObj);
                return;
            }

            /* ------------------------- group members commands ------------------------- */
            if (commandsMembers[command]) {
                if (isGroup) {
                    commandsMembers[command](sock, mek.messages[0], from, args, msgInfoObj);
                    return;
                }
                await sock.sendMessage(
                    from,
                    {
                        text: "❌ Group command only!",
                    },
                    { quoted: mek.messages[0] }
                );
                return;
            }

            /* -------------------------- group admins commands ------------------------- */
            if (commandsAdmins[command]) {
                if (!isGroup) {
                    reply("❌ Group command only!");
                    return;
                }

                // if (!isBotGroupAdmins)  return reply(`❌ I'm not admin here`);

                if (isGroupAdmin || allowedNumbs.includes(senderNumb)) {
                    commandsAdmins[command](sock, mek.messages[0], from, args, msgInfoObj);
                    return;
                }
                await sock.sendMessage(
                    from,
                    {
                        text: '```kya matlab tum admin nhi ho.```',
                    },
                    { quoted: mek.messages[0] }
                );
                return;
            }

            /* ----------------------------- owner commands ----------------------------- */
            if (commandsOwners[command]) {
                if (allowedNumbs.includes(senderNumb) || (myNumber == senderNumb)) {
                    commandsOwners[command](sock, mek.messages[0], from, args, msgInfoObj);
                    return;
                }
                await sock.sendMessage(
                    from,
                    {
                        text: "❌ Owner command only!",
                    },
                    { quoted: mek.messages[0] }
                );
                return;
            }

            //---------------------------------------no-cmds----------------------------//
            sock.sendMessage(
                from,
                {
                    text: `*${mek.messages[0].pushName}* \n\n*Please Wait*. This is new version of myBitBot.\nAll commands are not added yet.`
                },
                { quoted: mek.messages[0] }
            );

        } catch (err) {
            console.log(err);
            return;
        }
    });


    //------------------------connection.update------------------------------//
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
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
        console.log("connection update", update);
    });
};


startSock();