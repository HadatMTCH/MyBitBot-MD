const axios = require("axios");

module.exports.command = () => {
    let cmd = ["fact"];
    return { cmd, handler };
}


const handler = async (sock, msg, from, args, msgInfoObj) => {
    const factURL = "https://nekos.life/api/v2/fact";
    await axios(factURL).then((res) => {
        sock.sendMessage(
            from,
            { text: `ʕ•̫͡•ʔ Fact ʕ•̫͡•ʔ\n\n${res.data.fact}` },
            { quoted: msg }
        );
    });
}