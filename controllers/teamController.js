const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

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
}

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

const getTeamMatches = async (req, res) => {
    try {
        const { id } = req.params;
        const { status = 'SCHEDULED', limit = 10 } = req.query;

        const response = await axios.get(
            `https://api.football-data.org/v4/teams/${id}/matches`,
            {
                params: {
                    status,
                    limit
                },
                headers: {
                    'X-Auth-Token': FOOTBALL_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching team matches:', error);
        res.status(500).json({
            error: 'Failed to fetch team matches',
            message: error.response?.data?.message || error.message
        });
    }
}

module.exports = {
    getAllTeam,
    getTeamDetail,
    getTeamMatches
}