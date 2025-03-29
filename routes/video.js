const express = require('express');
const { getVideos, getRelatedVideos, getRelatedVideosBattle } = require('../controllers/videoController');

const router = express.Router()

router.get('/', getVideos)
router.get('/related-videos/:keyword', getRelatedVideos)
router.get('/related-videos-battle', getRelatedVideosBattle)

module.exports = router;