module.exports.command = () => {
    let cmd = ["jid", "grpid"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { isGroup } = msgInfoObj;
    if (!isGroup) return;
    sock.sendMessage(
        from,
        { text: from },
        { quoted: msg }
    );
}