const db = require('../database/database');
module.exports = async () => {
  let key = await db.getKeys()
  for(let i = 0;i < key.length;i++) {
    let test = db.updateKey(key[i]._id, {
      username: key[i].username, 
      apikey: key[i].apikey, 
      requests: 0, 
      createdAt: key[i].createdAt
    })
    console.log("Key:updated: ", test.apikey);
  }
}