module.exports.command = () => {
    let cmd = ["link", "grplink", "getlink"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { isBotGroupAdmins } = msgInfoObj;
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }
    if (!isBotGroupAdmins) return reply(`❌ I'm not admin here`);
    const gc_invite_code = await sock.groupInviteCode(from)
    gc_link = `https://chat.whatsapp.com/${gc_invite_code}`;
    sock.sendMessage(
        from,
        { text: gc_link },
        {
            quoted: msg
        }
    );
}