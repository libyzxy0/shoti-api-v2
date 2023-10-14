const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const cors = require('cors');

//Functions
const {
  addShoti,
  customPlay,
  newKey,
  checkKey
} = require('../controllers/api');
let getShoti = require('../controllers/handle-request');

router.use(cors())
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
// Parse incoming request bodies as JSON
router.use(bodyParser.json());

//Routes

router.get('/', (req, res) => res.redirect('/'))
router.route('/get-shoti').get(getShoti).post(getShoti);
router.route('/add-shoti').get(addShoti).post(addShoti);
router.route('/play').get(customPlay);
router.route('/new-key').post(newKey);
router.route('/check-key').post(checkKey);
module.exports = router;