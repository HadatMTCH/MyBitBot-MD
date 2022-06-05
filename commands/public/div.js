module.exports.command = () => {
    let cmd = ["dev", "source"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgTnfoObj) => {
    let { prefix } = msgTnfoObj;
    const templateButtons = [
        { index: 1, urlButton: { displayText: '⭐ Project Link!', url: 'https://github.com/jacktheboss220/MyBitBot-MD' } },
        { index: 2, urlButton: { displayText: 'Contact Me!', url: 'https://github.com/jacktheboss220/MyBitBot-MD/issues' } },
        { index: 3, quickReplyButton: { displayText: `Thank You!!`, id: 'id1' } }
    ]
    const templateMessage = {
        text: "ɢɪᴠᴇ ᴀ ꜱᴛᴀʀ ɪꜰ ʏᴏᴜ ʟɪᴋᴇ ᴛʜᴇ ʙᴏᴛ\n\nꜰᴏᴜɴᴅ ᴀ ʙᴜɢ ᴏʀ ᴇʀʀᴏʀ ᴄᴏɴᴛᴀᴄᴛ ᴍᴇ ʙᴇʟᴏᴡ",
        footer: 'ᴹʸᴮᴵᵀᴮᴼᵀ',
        templateButtons: templateButtons
    }
    await sock.sendMessage(from, templateMessage);
}