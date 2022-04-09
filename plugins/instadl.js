const axios = require("axios");
const INSTA_API_KEY = 'InpR9sR6Ac';
// const url = 'https://www.instagram.com/p/Cb2CLeIvX5I';
// const url = 'https://www.instagram.com/tv/Cb4xbvsFnsR';
// const url ='https://www.instagram.com/reel/CbswjfjJuLs'
const url='https://www.instagram.com/p/Cb2B6eWuf5d/'
const baseURL = `https://api-xcoders.xyz/api/download/ig?url=${url}?igshid=g26k5coikzwr&apikey=${INSTA_API_KEY}`
axios.get(baseURL).then((response) => {
    if (response.data.status == true) {
        console.log(response.data.result);
        // console.log('Caption : ', response.data.result.caption);
    }
    else {
        console.log('error');
    }
}).catch(function (error) {
    console.error(error);
});