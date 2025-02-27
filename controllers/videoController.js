const { default: axios } = require("axios");
const { YOUTUBE_SEARCH_URL, YOUTUBE_API_KEY } = require("../utils");

const getVideos = async (req, res) => {

    try {
        const response = await axios.get(YOUTUBE_SEARCH_URL, {
            params: {
                part: "snippet",
                q: "Premier League highlights",
                maxResults: 10,
                type: "video",
                key: YOUTUBE_API_KEY,
            },
        });

        if (!response.data || !response.data.items) {
            return res.status(500).json({ error: "No video data available" });
        }

        // Format lại danh sách video
        const videos = response.data.items.map((video) => ({
            title: video.snippet.title,
            description: video.snippet.description,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            thumbnail: video.snippet.thumbnails.high.url,
        }));

        res.json(videos);
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
}

module.exports = {
    getVideos
}