module.exports.command = () => {
    let cmd = ["bb", "broadcast"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { evv } = msgInfoObj;
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        )
    }
    if (!args[0]) return reply(`Type message to broadcast`);
    evv = '\n─「 ```ʙʀᴏᴀᴅᴄᴀꜱᴛ ᴍᴇꜱꜱᴀɢᴇ ꜱᴇɴᴅ ʙʏ ᴏᴡɴᴇʀ``` 」─\n\n' + evv;
    await sock.groupFetchAllParticipating().then((res) => {
        Object.keys(res).forEach((value) => {
            sock.sendMessage(
                value,
                { text: evv },
            );
        })
    })
}