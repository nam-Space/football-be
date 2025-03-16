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

const getMatchesOfTeamId = async (req, res) => {
    try {
        const teamId = req.params.teamId

        const response = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}/matches`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY },
            params: {
                status: req.query.status || 'SCHEDULED,LIVE,FINISHED', // Default to all matches
                limit: req.query.limit || 10
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
}

const getStatisticOfTeamId = async (req, res) => {
    try {
        const teamId = req.params.teamId

        // This is a simplified example as the API doesn't have a direct statistics endpoint
        // You might need to calculate statistics from matches data
        const matchesResponse = await axios.get(`${FOOTBALL_API_URL}/teams/${teamId}/matches?status=FINISHED&limit=20`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
        });

        // Process matches to extract statistics
        const matches = matchesResponse.data.matches;
        const stats = {
            played: matches.length,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0
        };

        matches.forEach(match => {
            const isHomeTeam = match.homeTeam.id === teamId;
            const manUtdGoals = isHomeTeam ? match.score.fullTime.home : match.score.fullTime.away;
            const opponentGoals = isHomeTeam ? match.score.fullTime.away : match.score.fullTime.home;

            stats.goalsFor += manUtdGoals || 0;
            stats.goalsAgainst += opponentGoals || 0;

            if (manUtdGoals > opponentGoals) stats.won++;
            else if (manUtdGoals < opponentGoals) stats.lost++;
            else stats.drawn++;
        });

        res.json({ statistics: stats });
    } catch (error) {
        console.error('Error calculating statistics:', error.message);
        res.status(500).json({ error: 'Failed to calculate statistics' });
    }
}

module.exports = {
    getAllMatch,
    getAllMatchDetail,
    getMatchesOfTeamId,
    getStatisticOfTeamId
}