const express = require('express');
const { getCompetitionStandingDetail, getCompetitionMatches } = require('../controllers/competitionController');

const router = express.Router()

router.get('/standings', getCompetitionStandingDetail)
router.get('/competition-matches', getCompetitionMatches)

module.exports = router;