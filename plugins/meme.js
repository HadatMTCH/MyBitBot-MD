const fs = require('fs')
const axios = require('axios')
module.exports.downloadmeme = async (url, path) => {
    // const downloadmeme = async (url) => {
    const writer = fs.createWriteStream(path)
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}
// downloadmeme(url);