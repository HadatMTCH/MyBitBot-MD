module.exports.command = () => {
    let cmd = ["add"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { prefix, evv, isBotGroupAdmins } = msgInfoObj;
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
    }
    else {
        if (!args[0]) return reply(`❌ give number or tag on message`);
        if (evv.startsWith("+")) evv = evv.split("+")[1];
        taggedJid = evv + '@s.whatsapp.net';
    }
    await sock.groupParticipantsUpdate(
        from,
        [taggedJid],
        "add"
    )
}