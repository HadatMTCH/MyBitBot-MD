require('dotenv').config();
const myNumber = process.env.myNumber + '@s.whatsapp.net';
const INSTA_API_KEY = process.env.INSTA_API_KEY;
const { igApi, getSessionId } = require('insta-fetcher');
let ig = new igApi(INSTA_API_KEY);
ig.setCookie(INSTA_API_KEY);


module.exports.command = () => {
    let cmd = ["idp", "ipp"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {

    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }

    const OwnerSend = (take) => {
        sock.sendMessage(
            myNumber,
            { text: take }
        )
    }

    let prof = args[0];
    (async () => {
        await ig.fetchUser(prof).then((res) => {
            sock.sendMessage(
                from,
                {
                    image: { url: res.hd_profile_pic_url_info.url },
                    caption: `Send by myBitBot`
                },
                {
                    quoted: msg
                }
            )
            OwnerSend(JSON.stringify(res));
        }).catch((err) => {
            console.log("Error", err);
            reply("Error try again after sometime");
        });
    })();
}