const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

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

module.exports = {
    getAllTeam,
    getTeamDetail
}