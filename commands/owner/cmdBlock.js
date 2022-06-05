const { getCmdToBlock, setCmdToBlock } = require('../../DB/cmdBlockDB');

module.exports.command = () => {
    let cmd = ["blockc", "emptyc", "getblockc", "removec"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { command, isGroup } = msgInfoObj;

    if (!isGroup) return;

    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            { quoted: msg }
        );
    }

    var resBlock = await getCmdToBlock(from);

    switch (command) {
        case "blockc":
            if (!args[0]) return reply(`Enter a cmd to block`);
            resBlock = (resBlock == -1 || resBlock == '') ? args[0] : resBlock + ',' + args[0];
            setCmdToBlock(from, resBlock).then(() => {
                console.log("blocked");
                reply('*Blocked* _' + args[0] + '_ *in this group*.');
            });
            break;

        case 'emptyc':
            setCmdToBlock(from, '').then(() => {
                console.log('Done');
                reply(`*Remove all cmd from db*`);
            });
            break;

        case 'getblockc':
            if (resBlock == -1 || resBlock == '') {
                console.log("empty");
                reply('Empty');
            } else {
                console.log(resBlock);
                reply(`*Commands Block in this Group are* : ` + resBlock);
            }
            break;

        case 'removec':
            if (!args[0]) return reply(`Enter a cmd to block`);
            let resBlockC = [];
            resBlock = resBlock.split(",");
            for (let i = 0; i < resBlock.length; i++) {
                if (resBlock[i] == args[0]);
                else
                    resBlockC.push(resBlock[i]);
            }
            setCmdToBlock(from, resBlockC.toString()).then(() => {
                reply('*Allowed* _' + args[0] + ' *in this Group*.')
            })
            break;
        default:
            break;
    }


}
