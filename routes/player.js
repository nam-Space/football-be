const express = require("express");
const { 
    getPlayerDetail, 
    getPlayerStats, 
    getPlayerCareerStats, 
    getPlayerImage 
} = require("../controllers/playerController");

const router = express.Router();

router.get("/:playerId", getPlayerDetail); // Lấy thông tin chi tiết cầu thủ
router.get("/stats/:playerId", getPlayerStats); // Lấy thống kê cầu thủ
router.get("/career-stats/:playerId", getPlayerCareerStats); // Lấy thống kê sự nghiệp cầu thủ
router.get("/player-image-url/:playerName", getPlayerImage); // Lấy ảnh cầu thủ

module.exports = router;
