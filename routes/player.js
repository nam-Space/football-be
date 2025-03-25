const express = require('express');
const { getPlayerDetail, getPlayerImage } = require('../controllers/playerController');

const router = express.Router()

router.get('/:playerId', getPlayerDetail),
    router.get('/player-image-url/:playerName', getPlayerImage),

    module.exports = router;