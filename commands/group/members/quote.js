const axios = require("axios");

module.exports.command = () => {
    let cmd = ["quote"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            // { quoted: msg }
        );
    }
    let url = "https://zenquotes.io/api/random";
    await axios(url).then((res) => {
        let quote = res.data[0].q + '\n\n~*By*: ' + res.data[0].a;
        reply(`ʕ•̫͡•ʔ❤️ 𝗧𝗼𝗱𝗮𝘆'𝘀 𝗤𝘂𝗼𝘁𝗲 𝗙𝗼𝗿 𝗬𝗼𝘂  ❤️ʕ•̫͡•ʔ\n\n${quote} `);
    });
}