const express = require('express');
const { getBattleByTeamId,
    getBattleById,
    getBattleStatisticByTeamId,
    getBattleReportById,
    getBattleStatisticById,
    getBattleReportByTeamId,
    getBattleCommentaryByBattleId,
    getBattleCommentaryByTeamId,
    getBattleHighlightByTeamId,
    getBattleHeadToHeadByTeamId,
    getBattleLineupById
} = require('../controllers/battleController');

const router = express.Router()

router.get('/', getBattleByTeamId)
router.get('/battle-detail/:id', getBattleById)
router.get('/stats/:id', getBattleStatisticById)
router.get('/battle-stats', getBattleStatisticByTeamId)
router.get('/report/:id', getBattleReportById)
router.get('/battle-report', getBattleReportByTeamId)
router.get('/commentary/:id', getBattleCommentaryByBattleId)
router.get('/battle-commentary', getBattleCommentaryByTeamId)
router.get('/battle-highlights', getBattleHighlightByTeamId)
router.get('/head-to-head', getBattleHeadToHeadByTeamId)
router.get('/lineup/:id', getBattleLineupById)

module.exports = router;