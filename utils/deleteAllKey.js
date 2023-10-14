const db = require('../database/database');
module.exports = async () => {
  let key = await db.getKeys()
  for (let i = 0; i < 100; i++) {
    if (key[i].requests == 0) {
      let test = await db.deleteKey(key[i]._id);
      console.log("Key:deleted: ", test);
    }
  }
}