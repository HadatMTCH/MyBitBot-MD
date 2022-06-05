module.exports.command = () => {
    let cmd = ["alive", "a"];
    return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { prefix, isGroup } = msgInfoObj;
    if (!isGroup) return;

    const buttons = [
        { buttonId: 'id1', buttonText: { displayText: `${prefix}help` }, type: 1 }
    ]

    const buttonMessage = {
        text: "```⌊ *ɢʀᴇᴇᴛɪɴɢ* !! " + msg.pushName + " ⌋```",
        footer: "```🫠🅈🄴🅂 🄸'🄼 🄰🄻🄸🅅🄴🫠```",
        buttons: buttons,
        headerType: 1
    }
    await sock.sendMessage(from, buttonMessage);
};