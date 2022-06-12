const axios = require('axios');
const { Facebook } = require('social-downloader-sdk');

module.exports.command = () => {
    let cmd = ["fb", "facebook"];
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

    if (!args[0]) return reply(`Enter Url after fb`);

    let FBurl;
    await axios(args[0]).then((response) => {
        FBurl = response.request._redirectable._currentUrl
    }).then(() => {
        (async () => {
            const res = await Facebook.getVideo(`${FBurl}`);
            if (res.data.hasError == false) {
                reply(`*Downloading Pls wait...*`)
                if (res.data.body.videoHD) {
                    sock.sendMessage(
                        from,
                        {
                            video: { url: res.data.body.videoHD },
                            caption: 'Send by myBitBot'
                        },
                        {
                            quoted: msg
                        }
                    )
                } else {
                    sock.sendMessage(
                        from,
                        {
                            video: { url: res.data.body.video },
                            caption: 'Send by myBitBot'
                        },
                        {
                            quoted: msg
                        }
                    )
                }
            } else if (res.data.hasError == true) {
                reply(res.data.errorMessage)
            }
        })();
    });
}