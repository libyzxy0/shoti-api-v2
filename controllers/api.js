const asyncWrapper = require('../middleware/async');
const db = require('../database/database')
const tiktok = require('../utils/tiktok-handler');

module.exports.addShoti = asyncWrapper(async (req, res) => {
  const { url: url_i, apikey } = req.body;

  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(3);
  let videos = await db.getVideos()
  //Check the url if defined
  if (!!url_i) {
    //Check the url if already exists
    if (!videos.find(({ url }) => url === url_i)) {
      db.createVideo({
        url: url_i,
        id: uniqueId,
        addedDate: new Date()
      })
        .then((resp) => {
          res.status(200).send({
            code: 200,
            message: "Video successfully added!",
            id: uniqueId
          })
        })
        .catch((err) => {
          console.log(err)
          res.status(400).send({
            code: 400,
            message: "Something went wrong when adding url!"
          })
        })
    } else {
      res.status(400).send({ code: 400, message: "Url already exists" })
    }
  } else {
    res.status(400).send({ code: 400, message: "Something went wrong" })
  }
})
module.exports.customPlay = asyncWrapper(async (req, res) => {
  let id_i = req.query.id;
  if (!id_i) {
    return res.status(400).send({ code: 400, message: "Something went wrong" })
  }
  let videos = await db.getVideos()
  if (videos.find(({ id }) => id === id_i)) {
    let data = videos.find(({ id }) => id === id_i);
    let tt = await tiktok.getVideoInfo(data.url);
    res.type('json').send(JSON.stringify({
      url: tt.data.url,
    }, null, 2) + '\n');
  } else {
    res.status(400).send({ code: 400, message: "Not found" })
  }
})

module.exports.newKey = asyncWrapper(async (req, res) => {
   const uniqueId = Date.now().toString(32) + Math.random().toString(32).substr(3);
  db.createKey({
    username: req.body.username,
    apikey: `shoti-${uniqueId}`,
    requests: 0,
    createdAt: new Date()
  })
    .then((response) => {
      res.status(200).send({
        code: 200,
        message: "Apikey successfully generateed!",
        data: {
          username: req.body.username,
          apikey: `shoti-${uniqueId}`
        }
      })
      req.io.emit('request', `User created a new apikey named '${req.body.username}' at ${new Date().toString()}.`);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        code: 400,
        message: "Apikey failed to generate!"
      })
    })
})
module.exports.checkKey = asyncWrapper(async (req, res) => {
  let apikeys = await db.getKeys();
  if (apikeys.find(({ apikey }) => apikey === req.body.apikey)) {
    res.status(200).send({ verified: true })
  } else {
    res.status(200).send({ verified: false })
  }
})