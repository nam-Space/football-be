const express = require('express');
const { getTeamDetail, getAllTeam } = require('../controllers/teamController');

const router = express.Router()

router.get('/', getAllTeam)
router.get('/:teamId', getTeamDetail)

module.exports = router;