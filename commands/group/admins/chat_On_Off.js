module.exports.command = () => {
    let cmd = ["chat"];
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
    if (!args[0]) return reply(`❌ *Provide On/Off*`);

    args[0] = args[0].toLowerCase();

    if (args[0] == 'off') {
        sock.groupSettingUpdate(from, 'announcement');
        reply(`✔️ *Only Admin can send Message*`);
    } else if (args[0] == 'on') {
        sock.groupSettingUpdate(from, 'not_announcement');
        reply(`✔️ *Allowed all member can send Message*`);
    } else {
        return reply(`❌ *Provide right args*`);
    }
}