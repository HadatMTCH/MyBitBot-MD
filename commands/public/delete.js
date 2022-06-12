module.exports.command = () => {
    let cmd = ["delete", "d", "del"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { botNumberJid, isGroup } = msgInfoObj;

    if (!isGroup) return;

    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            // { quoted: msg }
        );
    }
    try {
        if (!msg.message.extendedTextMessage) return reply(`❌ Tag message of bot to delete.`);
        if (!(msg.message.extendedTextMessage.contextInfo.participant == botNumberJid)) {
            reply(`❌ Tag message of bot to delete.`);
            return;
        }
        const options = {
            remoteJid: botNumberJid,
            fromMe: true,
            id: msg.message.extendedTextMessage.contextInfo.stanzaId
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
}