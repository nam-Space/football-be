const express = require('express');
const { getCompetitionStandingDetail } = require('../controllers/competitionController');

const router = express.Router()

router.get('/standings', getCompetitionStandingDetail)

module.exports = router;