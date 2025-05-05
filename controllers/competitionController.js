const { default: axios } = require("axios");
const { FOOTBALL_API_URL, FOOTBALL_API_KEY } = require("../utils");

// Lấy thông tin giải đấu
const getCompetitionDetail = async (req, res) => {
    const { competitionId = 2021 } = req.query; // Mặc định là Premier League (ID: 2021)
  
    try {
      const response = await axios.get(`${FOOTBALL_API_URL}/competitions/${competitionId}`, {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching competition detail:", error.message);
      res.status(500).json({ error: "Failed to fetch competition detail" });
    }
  };
  
  // Lấy bảng xếp hạng
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

// Lấy danh sách vua phá lưới
const getCompetitionScoreDetail = async (req, res) => {
    const { competitionId = 2021 } = req.query;
    const params = { ...req.query };
    delete params.competitionId;
  
    try {
      const response = await axios.get(`${FOOTBALL_API_URL}/competitions/${competitionId}/scorers`, {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
        params,
      });
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching scorers:", error.message);
      res.status(500).json({ error: "Failed to fetch scorers" });
    }
};

// Lấy danh sách trận đấu
const getCompetitionMatches = async (req, res) => {
    try {
        const { competitionId = 2021, matchday, dateFrom, dateTo } = req.query;

        const params = {};
        if (matchday) params.matchday = matchday;
        if (dateFrom) params.dateFrom = dateFrom;
        if (dateTo) params.dateTo = dateTo;

        const response = await axios.get(
            `${FOOTBALL_API_URL}/competitions/${competitionId}/matches`,
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
};

// Lấy danh sách đội bóng trong giải đấu
const getCompetitionTeams = async (req, res) => {
    try {
        const { competitionId = 2021, season } = req.query;

        const params = {};
        if (season) params.season = season;

        const response = await axios.get(
            `${FOOTBALL_API_URL}/competitions/${competitionId}/teams`,
            {
                params,
                headers: {
                    'X-Auth-Token': FOOTBALL_API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching competition teams:', error);
        res.status(500).json({
            error: 'Failed to fetch competition teams',
            message: error.response?.data?.message || error.message
        });
    }
};

module.exports = {
    getCompetitionDetail,
    getCompetitionStandingDetail,
    getCompetitionScoreDetail,
    getCompetitionMatches,
    getCompetitionTeams
};