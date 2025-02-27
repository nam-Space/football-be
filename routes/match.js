const express = require('express');
const { getAllMatch, getAllMatchDetail } = require('../controllers/matchController');

const router = express.Router()

router.get('/', getAllMatch)
router.get('/:matchId', getAllMatchDetail)

module.exports = router;