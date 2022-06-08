const {
    getCountWarning,
    setCountWarning,
    removeWarnCount
} = require('../../../DB/warningDB');

require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';

module.exports.command = () => {
    let cmd = ["warn", "warning", "unwarn"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { command, isBotGroupAdmins, isGroupAdmin, botNumberJid } = msgInfoObj;

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
        );
    }

    if (!msg.message.extendedTextMessage) {
        reply("❌ Tag someone! or reply on message");
        return;
    }

    let taggedJid;
    if (msg.message.extendedTextMessage.contextInfo.participant) {
        taggedJid = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
        taggedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }
    OwnerSend('Target : ' + taggedJid);
    if (taggedJid == botNumberJid) return reply(`_How I can Block/Unblock Myself_`);
    if (taggedJid == myNumber) return reply(`_Can't Block/Unblock Owner or Moderator_`);

    const warnCount = await getCountWarning(taggedJid, from);
    let num_split = taggedJid.split("@s.whatsapp.net")[0];
    let warnMsg;
    switch (command) {
        case 'getwarn':
            OwnerSend("Target : " + taggedJid);
            warnMsg = `@${num_split}, Your warning status is (${warnCount}/3) in this group.`;
            sock.sendMessage(
                from,
                {
                    text: warnMsg,
                    mentions: [taggedJid]
                }
            );
            break;

        case 'warn':
        case 'warning':
            warnMsg = `@${num_split} 😒,You have been warned. Warning status (${warnCount + 1
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
                if (isGroupAdmin) {
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
            break;
        case 'unwarn':
            await removeWarnCount(taggedJid, from);
            reply(`Set Warn Count to 0 for this user.`);
            break;
    }
}