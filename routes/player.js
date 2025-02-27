const express = require('express');
const { getPlayerDetail } = require('../controllers/playerController');

const router = express.Router()

router.get('/:playerId', getPlayerDetail)

module.exports = router;