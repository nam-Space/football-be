const express = require('express');
const { 
    getCompetitionStandingDetail, 
    getCompetitionDetail, 
    getCompetitionScoreDetail, 
    getCompetitionMatches 
} = require('../controllers/competitionController');

const router = express.Router();

router.get('/', getCompetitionDetail);
router.get('/standings', getCompetitionStandingDetail);
router.get('/scorers', getCompetitionScoreDetail);
router.get('/competition-matches', getCompetitionMatches);

module.exports = router;
