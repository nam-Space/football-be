const express = require('express');
const { getNews, getRelatedNews, getNewsDetail, getRelatedNewsBattle } = require('../controllers/newsController');

const router = express.Router()

router.get('/', getNews)
router.get('/related-news/:keyword', getRelatedNews)
router.get('/related-news-battle', getRelatedNewsBattle)
router.get('/news-detail', getNewsDetail)

module.exports = router;