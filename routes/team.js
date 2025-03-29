const express = require('express');
const { getTeamDetail, getAllTeam, getTeamMatches } = require('../controllers/teamController');

const router = express.Router()

router.get('/', getAllTeam)
router.get('/:teamId', getTeamDetail)
router.get('/team-matches/:id', getTeamMatches)

module.exports = router;