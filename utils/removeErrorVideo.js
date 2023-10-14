const db = require('../database/database');
const tiktok = require('./tiktok-handler')
let count = 0;
module.exports = async () => {
  let videos = await db.getVideos()
  for(let i = 0;i < videos.length;i++) {
  try {
    let vid = await tiktok.getVideoInfo(videos[i].url);
    let id = videos[i]._id;
    if(vid.error) {
      //let test = await db.deleteVideo(id)
      count = count + 1;
      console.log(count)
      console.log("data: ", videos[i].id)
    }
  } catch (err) {
    console.log(err)
  }
   }
}