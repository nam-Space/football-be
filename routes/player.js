const express = require("express")
const { getPlayerDetail, getPlayerStats, getPlayerCareerStats } = require("../controllers/playerController")

const router = express.Router()

router.get("/:playerId", getPlayerDetail) // Lấy thông tin chi tiết cầu thủ
router.get("/stats/:playerId", getPlayerStats) // Lấy thống kê cầu thủ

module.exports = router
