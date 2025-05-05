const express = require('express');
const { 
    getCompetitionStandingDetail, 
    getCompetitionDetail, 
    getCompetitionScoreDetail, 
    getCompetitionMatches,
    getCompetitionTeams,
} = require('../controllers/competitionController');

const router = express.Router()

router.get('/', getCompetitionDetail);
router.get('/standings', getCompetitionStandingDetail);
router.get('/scorers', getCompetitionScoreDetail);
router.get('/competition-matches', getCompetitionMatches);
router.get('/competition-teams', getCompetitionTeams);

module.exports = router;