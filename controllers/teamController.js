const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

// Lấy danh sách đội bóng trong Premier League
const getAllTeam = async (req, res) => {
    try {
        const { competitionId = 2021 } = req.query; // PL

        const response = await axios.get(`${FOOTBALL_API_URL}/competitions/${competitionId}/teams`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
        });
        res.json({ ...response.data });
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
};

// Lấy thông tin chi tiết đội bóng
const getTeamDetail = async (req, res) => {
    try {
        const teamId = req.params.teamId;

        const response = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching team data:', error.message);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
};

// Lấy danh sách trận đấu của đội bóng
const getTeamMatches = async (req, res) => {
    try {
        const teamId = req.params.teamId || req.params.id; // Hỗ trợ cả hai cách gọi
        const params = { ...req.query }; // Dùng toàn bộ query params

        // Đảm bảo có giá trị mặc định
        if (!params.status) params.status = 'SCHEDULED';
        if (!params.limit) params.limit = 10;

        const response = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}/matches`, {
            headers: { "X-Auth-Token": FOOTBALL_API_KEY },
            params
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching team matches:", error.message);
        res.status(500).json({
            error: "Failed to fetch team matches",
            message: error.response?.data?.message || error.message
        });
    }
};

module.exports = {
    getAllTeam,
    getTeamDetail,
    getTeamMatches
};
