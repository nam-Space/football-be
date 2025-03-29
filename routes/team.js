const express = require('express');
const { getTeamDetail, getAllTeam, getTeamMatches } = require('../controllers/teamController');

const router = express.Router();

router.get('/', getAllTeam);
router.get('/:teamId', getTeamDetail);
router.get('/matches/:teamId', getTeamMatches);

module.exports = router;
