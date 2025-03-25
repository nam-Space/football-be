const { default: axios } = require("axios");
const { NEWS_DATA_API_KEY } = require("../utils");
const { fetchFullContent } = require("../utils/fetchFullContent");

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

const getRelatedNews = async (req, res) => {
    try {
        const { keyword } = req.params;
        const NEWSDATA_API_KEY = NEWS_DATA_API_KEY; // Thay bằng API key của bạn

        // Use NewsData.io to get related news about the team
        // Documentation: https://newsdata.io/docs/endpoints
        const newsResponse = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: NEWSDATA_API_KEY,
                // category: 'sports',
                q: keyword, // Search query with team name
                language: 'en',
                size: 3
            }
        });

        let newsItems = await Promise.all(newsResponse.data.results.map(async (article, index) => {
            // const html = await fetchFullContent(article.link, article.title)
            // if (html) {
            return {
                id: article.article_id,
                title: article.title,
                tag: article.source_id,
                image: article.image_url || `https://picsum.photos/seed/${keyword}-${index}/500/300`,
                url: article.link,
                publishedAt: article.pubDate,
                description: article.description,
                content: article.content,
            }
            // }
        }));

        newsItems = newsItems.filter(newsItem => newsItem ? true : false)

        res.json({ news: newsItems });
    } catch (error) {
        console.error('Error fetching news from NewsData.io:', error);
        res.status(500).json({
            error: 'Failed to fetch related news',
            message: error.response?.data?.message || error.message
        });
    }
}

const getNewsDetail = async (req, res) => {
    const { articleId } = req.query; // Lấy articleId từ query
    const NEWSDATA_API_KEY = NEWS_DATA_API_KEY; // Thay bằng API key của bạn

    if (!articleId) {
        return res.status(400).send({ message: 'Article ID is required' });
    }

    try {
        // Gọi API NewsData.io để lấy chi tiết bài viết (news articles)
        const response = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apikey: NEWSDATA_API_KEY,
                id: articleId // Lọc bài viết theo articleId (hoặc query phù hợp khác)
            }
        });

        // Kiểm tra nếu có bài viết
        if (response.data.results && response.data.results.length > 0) {
            const article = response.data.results[0];
            const html = await fetchFullContent(article.link) // Gọi fetchFullContent để lấy nội dung chi tiết

            res.json({
                id: articleId,
                title: article.title,
                description: article.description,
                content: article.content,
                publishedAt: article.pubDate,
                url: article.link,
                html
            });
        } else {
            res.status(404).send({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error fetching article', error });
    }
}

const getRelatedNewsBattle = async (req, res) => {
    try {
        const { team1, team2 } = req.query;

        if (!team1 && !team2) {
            return res.status(400).json({ error: 'Missing team names' });
        }

        // Use newsdata.io API if you have a key
        if (NEWS_DATA_API_KEY) {
            const searchQuery = team2 ? `${team1} ${team2} football` : `${team1} football`;

            const newsResponse = await axios.get('https://newsdata.io/api/1/news', {
                params: {
                    apikey: NEWS_DATA_API_KEY,
                    q: searchQuery,
                    language: 'en',
                    size: 3
                }
            });

            if (newsResponse.data.results && newsResponse.data.results.length > 0) {
                const news = newsResponse.data.results.slice(0, 3).map((article, index) => ({
                    id: article.article_id,
                    title: article.title,
                    image: article.image_url || `https://picsum.photos/seed/news-${index}/500/300`,
                    source: article.source_id || "Sports News",
                    url: article.link,
                    description: article.description
                }));

                return res.json({ news });
            }
        }

        // If no API key or no results, return mock data
        res.json({
            news: []
        });
    } catch (error) {
        console.error('Error fetching related news:', error);
        res.status(500).json({
            error: 'Failed to fetch related news',
            message: error.message
        });
    }
}

module.exports = {
    getNews,
    getRelatedNews,
    getNewsDetail,
    getRelatedNewsBattle
}