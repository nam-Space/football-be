const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

// Lấy danh sách đội bóng trong Premier League
const getAllTeam = async (req, res) => {
    try {
        const response = await axios.get(`${FOOTBALL_API_URL}/competitions/PL/teams`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
        });
        res.json({ ...response.data });
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
}

// Lấy thông tin chi tiết đội bóng
const getTeamDetail = async (req, res) => {
    try {
        const teamId = req.params.teamId

        const response = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching team data:', error.message);
        res.status(500).json({ error: 'Failed to fetch team data' });
    }
}

// Lấy danh sách trận đấu của đội bóng
const getTeamMatches = async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const params = { ...req.query };
  
      const response = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}/matches`, {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
        params,
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching team matches:", error.message);
      res.status(500).json({ error: "Failed to fetch team matches" });
    }
  };
  
module.exports = {
    getAllTeam,
    getTeamDetail,
    getTeamMatches,
};