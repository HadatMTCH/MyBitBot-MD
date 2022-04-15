module.exports.HelpGUI = (sock, from, name) => {
    const sections = [
        {
            title: "𝚄𝚜𝚎𝚛 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜",
            rows: [
                { title: ".alive", rowId: "option1", description: "ʟᴇᴛ ᴜ ᴋɴᴏᴡ ɪꜱ ʙᴏᴛ ᴏɴʟɪɴᴇ ᴏʀ ɴᴏᴛ" },
                { title: ".meme", rowId: "option2", description: "ɢᴇᴛ ᴀ ʀᴀɴᴅᴏᴍ ᴍᴇᴍᴇ" },
                { title: ".joke", rowId: "option3", description: "ɢᴇᴛ ʀᴀɴᴅᴏᴍ ᴊᴏᴋᴇ" }
            ]
        },
        // {
        //     title: "Section 2",
        //     rows: [
        //         { title: "Option 3", rowId: "option3" },
        //         { title: "Option 4", rowId: "option4", description: "This is a description V2" }
        //     ]
        // },
    ]
    const listMessage = {
        text: "╰┈➤ᴍʏ ɢᴜɪ ʟɪꜱᴛ",
        footer: "•——————•°•✿•°•——————•",
        title: "♥ ```Hello " + name + "``` ♥",
        buttonText: "*ᑕᒪIᑕK ᕼEᖇE*",
        sections
    }
    sock.sendMessage(from, listMessage)
}