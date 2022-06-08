module.exports.command = () => {
    let cmd = ["demote"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {

    let { groupMetadata, isBotGroupAdmins } = msgInfoObj;

    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }

    if (!isBotGroupAdmins) return reply(`❌ I'm not admin here`);

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