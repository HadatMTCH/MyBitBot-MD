const axios = require('axios')
const post = 8000;
server.get('/', (req, res) => { res.send('V-Bot server running...') })
server.listen(port, () => {
    console.clear()
    console.log('\nWeb-server running!\n')
})
const {
    default: makeWASocket,
    DisconnectReason,
    AnyMessageContent,
    delay,
    useSingleFileAuthState,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    MessageType,
    MessageOptions,
    Mimetype
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
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
    sock.ev.on("creds.update", saveState);
    // return sock;
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
    //***********************************************************//

    //************************************************************/
    const { downloadmeme } = require('./plugins/meme')
    //************************************************************/
    //-------------------------------------------messages.upsert----------------------------------//
    sock.ev.on("messages.upsert", async (mek) => {
        if (!mek.messages) return
        // console.log('M: ', mek.messages);
        if (mek.messages[0].key.fromMe) return;
        const botNumberJid = sock.user.jid;
        const msg = JSON.parse(JSON.stringify(mek)).messages[0];
        const from = msg.key.remoteJid;
        // console.log('From: ', from);
        const type = Object.keys(msg.message)[0];
        // console.log('Type: ', type);
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
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(prefix);
        const isGroup = from.endsWith("@g.us");
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
        let sender = isGroup ? msg.key.participant : mek.messages[0].key.remoteJid;
        const senderNumb = sender.includes(":") ? sender.split(":")[0] : sender.split("@")[0];
        if (msg.key.fromMe) sender = botNumberJid;
        const groupName = isGroup ? groupMetadata.subject : "";
        const groupDesc = isGroup ? groupMetadata.desc : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
        const isBotGroupAdmins = groupAdmins.includes(botNumberJid) || false;
        const isGroupAdmins = groupAdmins.includes(sender) || false;

        const isMedia = type === "imageMessage" || type === "videoMessage";
        const isTaggedImage = type === "extendedTextMessage" && type.includes("imageMessage");
        const isTaggedVideo = type === "extendedTextMessage" && type.includes("videoMessage");
        const isTaggedSticker = type === "extendedTextMessage" && type.includes("stickerMessage");
        const isTaggedDocument = type === "extendedTextMessage" && type.includes("documentMessage");

        ///////////////////////////////////////////
        //////////////////COMMANDS\\\\\\\\\\\\\\\\\
        ///////////////////////////////////////////
        if (isCmd) {
            // Display every command info
            console.log("[COMMAND]", command, "[FROM]", senderNumb, "[IN]", groupName);
            // Display every command info
            OwnerSend("[COMMAND] " + command + " [FROM] " + senderNumb + " [IN] " + groupName);
            switch (command) {
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

                case 'meme':
                    if (!isGroup) return;
                    reply(`*Sending...*`);
                    const memeURL = 'https://meme-api.herokuapp.com/gimme';
                    axios.get(`${memeURL}`).then((res) => {
                        let url = res.data.url;
                        console.log("MEME url: ", url);
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
                            // const buffer = fs.readFileSync("./pic.mp4") // load some gif
                            // const options = {
                            //     gifPlayback: true,
                            //     mimetype: Mimetype.gif,
                            //     caption: `${res.data.url}`
                            // } // some metadata & caption
                            sock.sendMessage(
                                from,
                                {
                                    video: { url: res.data.url },
                                    mimetype: 'video/mp4',
                                    caption: `${res.data.url}`,
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
                default:
                    if (isGroup)
                        reply(`*Error*`)
            }
        }
    });
};
startSock();
