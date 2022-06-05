require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const { setBlockWarning, removeBlockWarning } = require('../../DB/blockDB');

module.exports.command = () => {
    let cmd = ["block", "unblock"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { command, botNumberJid } = msgInfoObj;

    const reply = (text) => {
        sock.sendMessage(
            from,
            { text },
            { quoted: msg }
        );
    }
    const OwnerSend = (take) => {
        sock.sendMessage(
            myNumber,
            { text: take }
        )
    }

    if (!msg.message.extendedTextMessage) return reply("❌ Tag / mentioned!");

    let taggedJid;
    if (msg.message.extendedTextMessage) {
        taggedJid = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
        taggedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (taggedJid == botNumberJid) return reply(`_How I can Warn Myself_.😂`);
    if (taggedJid == myNumber) return reply(`🙄\n _Can't Warn Owner or Moderator_ 😊`);

    console.log('Target: ', taggedJid);
    OwnerSend('Target : ' + taggedJid);

    if (command == "block") {
        await setBlockWarning(taggedJid).then(() => {
            let num_split = taggedJid.split("@s.whatsapp.net")[0];
            let warnMsg = `@${num_split} ,You can't use the bot.`;
            sock.sendMessage(
                from,
                {
                    text: warnMsg,
                    mentions: [taggedJid]
                }
            );
        });
    }
    if (command == "unblock") {
        await removeBlockWarning(taggedJid).then(() => {
            reply(`✔️ *Unblocked*`)
        });
    }
}

