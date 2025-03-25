const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

const getCompetitionStandingDetail = async (req, res) => {
    const { competitionId = 2021 } = req.query;
    const params = { ...req.query }
    delete params.competitionId

    // const PREMIER_LEAGUE_ID = 2021; // Premier League competition ID

    try {
        const response = await axios.get(`${FOOTBALL_API_URL}/competitions/${competitionId}/standings`, {
            headers: { 'X-Auth-Token': FOOTBALL_API_KEY },
            params,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching standings:', error.message);
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
}

const getCompetitionMatches = async (req, res) => {
    try {
        const { competitionId = 2021, matchday, dateFrom, dateTo } = req.query;

        const params = {};
        if (matchday) params.matchday = matchday;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;

        const response = await axios.get(
            `https://api.football-data.org/v4/competitions/${competitionId}/matches`,
            {
                params,
                headers: {
                    'X-Auth-Token': FOOTBALL_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching competition matches:', error);
        res.status(500).json({
            error: 'Failed to fetch competition matches',
            message: error.response?.data?.message || error.message
        });
    }
}

module.exports = {
    getCompetitionStandingDetail,
    getCompetitionMatches
}