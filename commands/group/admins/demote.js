module.exports.command = () => {
    let cmd = ["demote"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    
    let { groupMetadata } = msgInfoObj;

    const reply = (text) => {
        sock.sendMessage(
            from,
            { text },
            { quoted: msg }
        );
    }

    let taggedJid;
    if (msg.message.extendedTextMessage) {
        taggedJid = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
        taggedJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (taggedJid == groupMetadata.owner) return reply(`❌ *Group Owner Tagged*`);

    await sock.groupParticipantsUpdate(
        from,
        [taggedJid],
        "demote"
    ).then(() => {
        reply(`✔️ *Demoted*`);
    });
}