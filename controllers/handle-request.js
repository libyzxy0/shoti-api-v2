const db = require('../database/database')
const tiktok = require('../utils/tiktok-handler');
const shuffleArray = require('../utils/shuffle-array');
const colors = require("colors");

const handleClientRequest = async (req, res) => {
  try {
    let uapikey;
    let refError;
    if (!!req.body.apikey) {
      uapikey = req.body.apikey;
    } else if (!!req.query.apikey) {
      uapikey = req.query.apikey;
    } else {
      let errData = {
        code: 401,
        message: "Unauthorized access",
        data: {
          url: "https://shoti-api.libyzxy0.repl.co/auth-err.mp4"
        }
      }
      return res.type('json').send(errData);
    }

      if (!!req.body.refresh_error) {
        refError = req.body.refresh_error === true ? true : false;
      } else if (!!req.query.refresh_error) {
        refError = req.query.refresh_error == 'true' ? true : false;
      } else {
        refError = false;
      }
    let apikeys = await db.getKeys();
    const rd = apikeys.find(({ apikey }) => apikey === uapikey);
    if (rd && rd.apikey != "shoti-1h9d3dcneqkb8vo4sog") {
      db.updateKey(rd._id, {
        username: rd.username,
        apikey: rd.apikey,
        requests: rd.requests + 1,
        createdAt: rd.createdAt
      })
      console.log(colors.blue(rd.username) + " at " + colors.green(`${new Date().toLocaleString()}`))

      req.io.emit('request', `${rd.requests + 1} | ${rd.username} | ${new Date().toLocaleString()}`)
    }

    if (!apikeys.find(({ apikey }) => apikey === uapikey)) {
      let errData = {
        code: 401,
        message: "Unauthorized access",
        data: {
          url: "https://shoti-api.libyzxy0.repl.co/auth-err.mp4"
        }
      }
      res.type('json').send(errData);
    } else {
      let cookedData;
      async function generate() {
      //Array of all videos
      let videos = await db.getVideos()
      //====Randomizer Start====
      //We shuffled the array for better randomizer performance
      let shuffledVideos1 = shuffleArray(videos);
      let shuffledVideos = shuffleArray(shuffledVideos1);
      //Randomly choose shuffled videos
      let video = shuffledVideos[Math.floor(shuffledVideos.length * Math.random())];
      let sub_video = shuffledVideos[Math.floor(shuffledVideos.length * Math.random())];
      //====Randomizer End====
      let tt = await tiktok.getVideoInfo(video.url);
      cookedData = {
          code: tt.error ? 500 : 200,
          message: tt.error ? "error" : "success",
          data: {
            url: tt.data.url,
            play: tt.data.play,
            wmplay: tt.data.wmplay,
            duration: tt.data.duration,
            id: video.id,
            error: tt.data.error
          },
          user: {
            username: tt.user.unique_id ? tt.user.unique_id : `Hello ${rd.username}, your requested source hasn't returned by the cdn.\n\nYou don't want to receive this error?, set 'refresh_error' option to true.`,
            nickname: tt.user.nickname,
            id: tt.user.id,
          },
        };
      }
       await  generate();
        if(cookedData.code != 200) {
        	await generate();
            return;
        }
        function removeNullProperties(obj) {
          for (const key in obj) {
            if (obj[key] === null) {
              delete obj[key];
            } else if (typeof obj[key] === "object") {
              removeNullProperties(obj[key]);
            }
          }
        }
        removeNullProperties(cookedData);
        
        
        res.type('json').send(JSON.stringify(cookedData, null, 2) + '\n');
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = handleClientRequest;