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
    *${prefix}ʜᴇʟᴘ* - _ɢᴇᴛ ᴍʏ ʜᴇʟᴘ ʟɪꜱᴛ_
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

module.exports.StockList = (prefix, groupName) => {
    return `
    ─「 *${groupName} User Stocks Commands* 」─
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

module.exports.adminList = (prefix, groupName) => {
    return `
    ─「 *${groupName} Admin Commands* 」─
${readMore}

*${prefix}add <phone number>*
    _Add any new member!_

*${prefix}ban <@mention>*
    _Kick any member out from group!_
    _Alias with ${prefix}remove, ${prefix}kick_

*${prefix}promote <@mention>*
    _Give admin permission to a member!_

*${prefix}demote <@mention>*
    _Remove admin permission of a member!_

*${prefix}rename <new-subject>*
    _Change group subject!_

*${prefix}chat <on/off>*
    _Enable/disable group chat_
    _${prefix}chat on - for everyone!_
    _${prefix}chat off - for admin only!_

*${prefix}removebot*
    _Remove bot from group!_
  
*${prefix}warn <@mention>*
    _Give Waring to a person_
    _Bot Will kick if person got 3 warning_

*${prefix}unwarn <@mention>*
    _remove Waring to a person_

*${prefix}block <@mention>*
    _block user from using bot_

*${prefix}unblock <@mention>*
    _unblock user_

*${prefix}tagall*
    _For attendance alert_
    _Eg: ${prefix}tagall message!_`

}

// *${prefix}score*
//     _fetch live ipl scores_
//     eg:${prefix} score
