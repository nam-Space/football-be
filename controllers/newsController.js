const { default: axios } = require("axios");

const getNews = async (req, res) => {
    try {
        const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news');
        const news = response.data.articles;
        res.json(news);
    } catch (error) {
        console.error('Error fetching Premier League news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}

module.exports = {
    getNews
}