const express = require('express')
const router = express.Router()
let db = require('../database/database');
const hCaptcha = require("hcaptcha");

//Routes
router.get('/', async (req, res) => {
  let videos = await db.getVideos();
  res.render('index', { count: videos.length })
})

router.get('/docs', async (req, res) => {
  req.io.emit('request', 'A user viewed documentation page');
  res.render('documentation')
})

router.get('/video-cdn/:id', (req, res) => {
  let url = `https://www.tikwm.com/video/media/hdplay/${req.params.id}.mp4`;
  res.redirect(url);
})

router.post('/key-verify', (req, res) => {
  const token = req.body.hcaptchaToken;
  hCaptcha.verify(process.env.H_CAPTCHA, token)
    .then((result) => {
      if (result.success) {
        res.json({ verified: true });
      } else {
        res.json({ verified: false });
      }
    })
    .catch((error) => {
      console.error('HCaptcha thrown this error: ', error);
      res.status(500).json({ error: 'Captcha verification failed.' });
    });
})

router.post('/get/vids', async (req, res) => {
  let data = await db.getVideos();
  res.type('json').send(JSON.stringify(data, null, 2) + '\n');
})
router.get('/url-list', (req, res) => {
   if(req.query.pin != process.env.PIN) return res.status(401).send({ error: "Unauthorized access" })
   res.render('videos')
}) 

router.post('/get/leaderboard', async (req, res) => {
  let data = await db.getKeys();
  data.sort((a, b) => b.requests - a.requests);
  const top = data.slice(0, 100);
  res.type('json').send(JSON.stringify(top, null, 2) + '\n')
})

router.get('/leaderboard', (req, res) => {
   req.io.emit('request', 'A user viewed leaderboard list.')
   res.render('leaderboard')
}) 


module.exports = router;