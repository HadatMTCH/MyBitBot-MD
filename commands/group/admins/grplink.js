module.exports.command = () => {
    let cmd = ["link", "grplink", "getlink"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {

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