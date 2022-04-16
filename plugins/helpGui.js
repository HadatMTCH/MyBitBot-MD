module.exports.HelpGUI = (sock, from, name) => {
    const sections = [
        {
            title: "𝚄𝚜𝚎𝚛 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜",
            rows: [
                { title: ".help", rowId: "option0", description: "ɢᴇᴛ ʜᴇʟᴘ ᴍᴇɴᴜ" },
                { title: ".alive", rowId: "option1", description: "ʟᴇᴛ ᴜ ᴋɴᴏᴡ ɪꜱ ʙᴏᴛ ᴏɴʟɪɴᴇ ᴏʀ ɴᴏᴛ" },
                { title: ".meme", rowId: "option2", description: "ɢᴇᴛ ᴀ ʀᴀɴᴅᴏᴍ ᴍᴇᴍᴇ" },
                { title: ".joke", rowId: "option3", description: "ɢᴇᴛ ʀᴀɴᴅᴏᴍ ᴊᴏᴋᴇ" }
            ]
        },
        {
            title: "HoroScope",
            rows: [
                { title: ".horo aries", rowId: "option4", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo taurus", rowId: "option5", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo gemini", rowId: "option6", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo cancer", rowId: "option7", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo leo", rowId: "option8", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo virgo", rowId: "option9", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo libra", rowId: "option10", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo scorpio", rowId: "option11", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo sagittarius", rowId: "option12", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo capricorn", rowId: "option5", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo aquarius", rowId: "option5", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" },
                { title: ".horo pisces", rowId: "option5", description: "ᴛᴏᴅᴀʏ'ꜱ ʜᴏʀᴏꜱᴄᴏᴘᴇ" }
            ]
        },
    ]
    const listMessage = {
        text: "╰┈➤ᴍʏ ɢᴜɪ ʟɪꜱᴛ",
        footer: "ᴮᴵᵀᴮᴼᵀ",
        title: "♥ ```Hello " + name + "``` ♥",
        buttonText: "*ᑕᒪIᑕK ᕼEᖇE*",
        sections
    }
    sock.sendMessage(from, listMessage)
}
