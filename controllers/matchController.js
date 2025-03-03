const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

const getAllMatch = async (req, res) => {
    try {
        // slug = 'competitions/PL/matches?dateFrom=2025-01-01&dateTo=2025-06-06&status=SCHEDULED'
        const slug = req.query.slug
        const response = await axios.get(`${FOOTBALL_API_URL}/${slug}`, {
            headers: { "X-Auth-Token": FOOTBALL_API_KEY },
        });

        res.json({
            data: { ...response.data },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllMatchDetail = async (req, res) => {
    try {
        const matchId = req.params.matchId;

        // Lấy dữ liệu trận đấu từ API
        const matchResponse = await axios.get(`${FOOTBALL_API_URL}/matches/${matchId}`, {
            headers: { "X-Auth-Token": API_KEY },
        });

        if (!matchResponse.data) {
            return res.status(500).json({ error: "Match data is missing" });
        }

        const matchData = matchResponse.data;
        const homeTeamId = matchData.homeTeam?.id;
        const awayTeamId = matchData.awayTeam?.id;

        if (!homeTeamId || !awayTeamId) {
            return res.status(500).json({ error: "Team IDs are missing" });
        }

        // Gọi API để lấy danh sách cầu thủ của đội chủ nhà
        const homeTeamResponse = await axios.get(`${FOOTBALL_API_URL}/teams/${homeTeamId}`, {
            headers: { "X-Auth-Token": API_KEY },
        });

        // Gọi API để lấy danh sách cầu thủ của đội khách
        const awayTeamResponse = await axios.get(`${FOOTBALL_API_URL}/teams/${awayTeamId}`, {
            headers: { "X-Auth-Token": API_KEY },
        });

        res.json({
            match: matchData,
            homePlayers: homeTeamResponse.data.squad || [],
            awayPlayers: awayTeamResponse.data.squad || [],
        });
    } catch (error) {
        console.error("Error fetching match details:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllMatch,
    getAllMatchDetail
}