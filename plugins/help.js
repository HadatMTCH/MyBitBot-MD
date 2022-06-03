const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

module.exports.userHelp = (prefix, groupName, name) => {
    return `
---------------------------------------------------------------
    ─「 *𝔾𝕣𝕖𝕖𝕥𝕚𝕟𝕘𝕤 ${name}* 」─     
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
}
module.exports.OwnerList = (prefix, groupName) => {
    return `U know`
}
module.exports.helpDM = (prefix) => {
    return `
    ─「 *Dm Commands* 」─
*${prefix}sticker*
    _Create a sticker from different media types!_
    *Properties of sticker:*
        _crop_ - Used to crop the sticker size!
        _author_ - Add metadata in sticker!
        _pack_ - Add metadata in sticker!
        _nometadata_ - Remove all metadata from sticker!
    *Examples:*
        _${prefix}sticker pack Blender author bot_
        _${prefix}sticker crop_
        _${prefix}sticker nometadata_D
    `
}
module.exports.StockList = (prefix, groupName, name) => {
    return `
---------------------------------------------------------------
    ─「 *𝔾𝕣𝕖𝕖𝕥𝕚𝕟𝕘𝕤 ${name}* 」─     
---------------------------------------------------------------

  𝕴'𝖒 𝕭𝖎𝖙 𝕭𝖔𝖙 𝖓𝖎𝖈𝖊 𝖙𝖔 𝖒𝖊𝖊𝖙 𝖞𝖔𝖚 :)

---------------------------------------------------------------
🅐🅓🅜🅘🅝 🅒🅞🅜🅜🅐🅝🅓 🅛🅘🅢🅣
---------------------------------------------------------------
${readMore}

*${prefix}price*
    _show crypto price_
    eg:vprice btc

*${prefix}stocks*
    _show stocks price_
    eg:${prefix}stocks zomato.bo
    for _BSI_ use *bo* as suffix
    for _NSI_ use *ns* as suffix

*${prefix}mmi*
    _show MMi status_
    with advice`
}

module.exports.adminList = (prefix, groupName, name) => {
    return `
---------------------------------------------------------------
    ─「 *𝔾𝕣𝕖𝕖𝕥𝕚𝕟𝕘𝕤 ${name}* 」─     
---------------------------------------------------------------

  𝕴'𝖒 𝕭𝖎𝖙 𝕭𝖔𝖙 𝖓𝖎𝖈𝖊 𝖙𝖔 𝖒𝖊𝖊𝖙 𝖞𝖔𝖚 :)

---------------------------------------------------------------
🅐🅓🅜🅘🅝 🅒🅞🅜🅜🅐🅝🅓 🅛🅘🅢🅣
---------------------------------------------------------------
${readMore}

*${prefix}ᴀᴅᴅ* - _ᴀᴅᴅ ᴀɴʏ ɴᴇᴡ ᴍᴇᴍʙᴇʀ!_
*${prefix}ʙᴀɴ* - _ᴋɪᴄᴋ ᴀɴʏ ᴍᴇᴍʙᴇʀ ᴏᴜᴛ ꜰʀᴏᴍ ɢʀᴏᴜᴘ!_
*${prefix}ᴘʀᴏᴍᴏᴛᴇ* - _ɢɪᴠᴇ ᴀᴅᴍɪɴ ᴘᴇʀᴍɪꜱꜱɪᴏɴ ᴛᴏ_ 
                    _ᴀ ᴍᴇᴍʙᴇʀ!_
*${prefix}ᴅᴇᴍᴏᴛᴇ* - _ʀᴇᴍᴏᴠᴇ ᴀᴅᴍɪɴ ᴘᴇʀᴍɪꜱꜱɪᴏɴ ᴏꜰ_ 
                    _ᴀ ᴍᴇᴍʙᴇʀ!_
*${prefix}ʀᴇɴᴀᴍᴇ* - _ᴄʜᴀɴɢᴇ ɢʀᴏᴜᴘ ꜱᴜʙᴊᴇᴄᴛ!_
*${prefix}ᴄʜᴀᴛ* - _ᴇɴᴀʙʟᴇ/ᴅɪꜱᴀʙʟᴇ ɢʀᴏᴜᴘ ᴄʜᴀᴛ_
*${prefix}ʀᴇᴍᴏᴠᴇʙᴏᴛ* - _ʀᴇᴍᴏᴠᴇ ʙᴏᴛ ꜰʀᴏᴍ ɢʀᴏᴜᴘ!_
*${prefix}ᴡᴀʀɴ* - _ɢɪᴠᴇ ᴡᴀʀɪɴɢ ᴛᴏ ᴀ ᴘᴇʀꜱᴏɴ_
*${prefix}ᴜɴᴡᴀʀɴ* - _ʀᴇᴍᴏᴠᴇ ᴡᴀʀɪɴɢ ᴛᴏ ᴀ ᴘᴇʀꜱᴏɴ_
*${prefix}ᴛᴀɢᴀʟʟ* - _ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ_


♥ мα∂є ωιтн ℓσνє, υѕє ωιтн ℓσνє ♥️`
}