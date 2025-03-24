const express = require('express');
const { getCompetitionStandingDetail, getCompetitionDetail, getCompetitionScoreDetail } = require('../controllers/competitionController');

const router = express.Router()

router.get('/', getCompetitionDetail)
router.get('/standings', getCompetitionStandingDetail)
router.get('/scorers', getCompetitionScoreDetail)

module.exports = router;