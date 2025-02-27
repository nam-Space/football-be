require('dotenv').config()

const FOOTBALL_API_URL = "https://api.football-data.org/v4";
const FOOTBALL_API_KEY = process.env.FOOTBALL_DATA_API_KEY

const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

const PORT = process.env.PORT || 8080;

module.exports = {
    FOOTBALL_API_URL,
    FOOTBALL_API_KEY,
    YOUTUBE_API_KEY,
    YOUTUBE_SEARCH_URL,
    PORT
}