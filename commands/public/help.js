const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

module.exports.command = () => {
    let cmd = ["help"];
    return { cmd, handler };
}

const handler = async (sock, msg, from, args, msgInfoObj) => {
    let { prefix, isGroup } = msgInfoObj;
    if (!isGroup) return;
    const help = `
---------------------------------------------------------------
    ─「 *𝔾𝕣𝕖𝕖𝕥𝕚𝕟𝕘𝕤 ${msg.pushName}* 」─     
---------------------------------------------------------------

  𝕴'𝖒 𝕭𝖎𝖙 𝕭𝖔𝖙 𝖓𝖎𝖈𝖊 𝖙𝖔 𝖒𝖊𝖊𝖙 𝖞𝖔𝖚 :)

---------------------------------------------------------------
🅤🅢🅔🅡 🅒🅞🅜🅜🅐🅝🅓 🅛🅘🅢🅣
---------------------------------------------------------------
${readMore}

    *${prefix}ʜᴇʟᴘ* - _ɢᴇᴛ ᴍʏ ʜᴇʟᴘ ʟɪꜱᴛ_
    *${prefix}ᴀᴅᴍɪɴ* - _ɢᴇᴛ ᴀᴅᴍɪɴ ʟɪꜱᴛ_
    *${prefix}ᴀʟɪᴠᴇ* - _ᴋɴᴏᴡ ɪꜰ ʙᴏᴛ ɪꜱ ᴏɴʟɪɴᴇ ᴏʀ ɴᴏᴛ_
    *${prefix}ᴛᴛꜱ* -    _ᴛᴇxᴛ ᴛᴏ ꜱᴛɪᴄᴋᴇʀ_
    *${prefix}ᴍᴇᴍᴇ* - _ɢᴇᴛ ʀᴀɴᴅᴏᴍ ᴍᴇᴍᴇ ꜰʀᴏᴍ_ 
                   _ʀᴇᴅᴅɪᴛ_
    *${prefix}ɪɴꜱᴛᴀ* - _ᴅᴏᴡɴʟᴏᴀᴅ ɪɴꜱᴛᴀɢʀᴀᴍ ᴘᴏꜱᴛ_ 
                   _ᴀɴᴅ ɪɢᴛᴠ_
    *${prefix}ʜᴏʀᴏ* -  _ɢᴇᴛ ʏᴏᴜʀ ʜᴏʀᴏꜱᴄᴏᴘᴇ ꜰᴏʀ_ 
                   _ᴛᴏᴅᴀʏ_
    *${prefix}ɪᴅᴘ* -   _ᴅᴏᴡɴʟᴏᴀᴅ ɪɴꜱᴛᴀ'ꜱ ᴘʀɪᴠᴀᴛᴇ_ 
                   _ᴀᴄᴄᴏᴜɴᴛ ᴅᴘ_
    *${prefix}ᴛᴇxᴛ* - _ᴀᴅᴅ ʜᴇᴀᴅᴇʀ ᴀɴᴅ ꜰᴏᴏᴛᴇʀ ɪɴ_ 
                   _ɪᴍᴀɢᴇ_
    *${prefix}ꜱᴛɪᴄᴋᴇʀ* - _ɪᴍᴀɢᴇ ᴏʀ ᴠɪᴅᴇᴏ ᴛᴏ ꜱᴛɪᴄᴋᴇʀ_
                   _ᴄʀᴏᴘ- ᴛᴏ ᴄʀᴏᴘ ꜱᴛɪᴄᴋᴇʀ_
                   _ɴᴏᴍᴇᴛᴀᴅᴀᴛᴀ - ᴡɪᴛʜᴏᴜᴛ ᴅᴀᴛᴀ_
                   _ᴘᴀᴄᴋ ᴀɴᴅ ᴀᴜᴛʜᴏʀ - ᴀᴅᴅ ᴅᴀᴛᴀ_
    *${prefix}ᴅᴇʟᴇᴛᴇ* - ᴅᴇʟᴇᴛᴇ ᴍᴇꜱꜱᴀɢᴇ ꜱᴇɴᴅ ʙʏ ʙᴏᴛ
    *${prefix}ᴅɪᴄ* - ɢᴇᴛ ᴡᴏʀᴅ ᴅᴇꜰɪɴɪᴛɪᴏɴꜱ
    *${prefix}ᴊᴏᴋᴇ* - ɢᴇᴛ ᴀ ʀᴀɴᴅᴏᴍ ᴊᴏᴋᴇ
    

♥ мα∂є ωιтн ℓσνє, υѕє ωιтн ℓσνє ♥️`

    sock.sendMessage(
        from,
        { text: help }
    );
}