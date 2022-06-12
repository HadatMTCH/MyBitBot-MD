const axios = require('axios');
module.exports.command = () => {
    let cmd = ["horo"];
    return { cmd, handler };
}

async function gethoro(sunsign) {
    var mainconfig = {
        method: 'POST',
        url: `https://aztro.sameerkumar.website/?sign=${sunsign}&day=today`
    }
    let horo;
    await axios.request(mainconfig).then((res) => {
        horo = res.data
    }).catch((error) => {
        return false;
    })
    return horo;
}

const handler = async (sock, msg, from, args, msgInfoObj) => {

    const reply = (take) => {
        sock.sendMessage(
            from,
            { text: take },
            // { quoted: msg }
        );
    }


    let horoscope = args[0];
    let h_Low = horoscope.toLowerCase();
    let l = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
    if (!l.includes(h_Low)) {
        reply("Kindly enter the right spelling ")
    } else {
        const callhoro = await gethoro(h_Low);
        console.log("horo", args[0]);
        reply(`*Date Range*:-${callhoro.date_range}
*Nature Hold's For you*:-${callhoro.description}
*Compatibility*:-${callhoro.compatibility}
*Mood*:-${callhoro.mood}
*color*:-${callhoro.color}
*Lucky Number*:-${callhoro.lucky_number}
*Lucky time*:-${callhoro.lucky_time}`);
    }
}