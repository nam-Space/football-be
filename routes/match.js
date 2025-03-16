const express = require('express');
const { getAllMatch, getAllMatchDetail, getMatchesOfTeamId, getStatisticOfTeamId } = require('../controllers/matchController');

const router = express.Router()

router.get('/', getAllMatch)
router.get('/teamId/:teamId', getMatchesOfTeamId)
router.get('/statistics/:teamId', getStatisticOfTeamId)
router.get('/:matchId', getAllMatchDetail)

module.exports = router;