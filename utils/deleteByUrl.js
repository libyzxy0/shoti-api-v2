const db = require('../database/database');
module.exports = async (url_i) => {
  let videos = await db.getVideos()
  if (videos.find(({ url }) => url === url_i)) {
    let data = videos.find(({ url }) => url === url_i)
    let test = await db.deleteUserById(data._id)
    console.log("Url deleted: ", test.url);
  }
}