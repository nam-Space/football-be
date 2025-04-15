const { default: axios } = require("axios");
const { YOUTUBE_SEARCH_URL, YOUTUBE_API_KEY } = require("../utils");
const { formatYouTubeDuration, formatViewCount } = require("../utils/youtube");

const getVideos = async (req, res) => {

    try {
        const response = await axios.get(YOUTUBE_SEARCH_URL, {
            params: {
                part: "snippet",
                q: "epl highlights k+ sport",
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

const getRelatedVideos = async (req, res) => {
    try {
        const { keyword } = req.params;

        // Use YouTube Data API to get real videos about the team
        // Documentation: https://developers.google.com/youtube/v3/docs/search/list
        const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `football "${keyword}"`,
                type: 'video',
                maxResults: 3,
                order: 'date',
                key: YOUTUBE_API_KEY
            }
        });

        // Get video details to include duration
        const videoIds = youtubeResponse.data.items.map(item => item.id.videoId).join(',');
        const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'contentDetails,statistics',
                id: videoIds,
                key: YOUTUBE_API_KEY
            }
        });

        // Create a map of video details
        const videoDetailsMap = {};
        videoDetailsResponse.data.items.forEach(item => {
            videoDetailsMap[item.id] = {
                duration: formatYouTubeDuration(item.contentDetails.duration),
                viewCount: formatViewCount(item.statistics.viewCount)
            };
        });

        // Transform the response to match our app's format
        const videoItems = youtubeResponse.data.items.map((item, index) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            tag: 'YouTube',
            image: item.snippet.thumbnails.high.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            duration: videoDetailsMap[item.id.videoId]?.duration || '0:00',
            viewCount: videoDetailsMap[item.id.videoId]?.viewCount || '0 views'
        }));

        res.json({ videos: videoItems });
    } catch (error) {
        console.error('Error fetching videos from YouTube API:', error);
        res.status(500).json({
            error: 'Failed to fetch related videos',
            message: error.response?.data?.message || error.message
        });
    }
}

const getRelatedVideosBattle = async (req, res) => {
    try {
        const { team1, team2 } = req.query;

        if (!team1 && !team2) {
            return res.status(400).json({ error: 'Missing team names' });
        }

        // Use YouTube API if you have a key
        if (YOUTUBE_API_KEY) {
            const searchQuery = team2 ? `${team1} ${team2} football` : `${team1} football`;

            const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: searchQuery,
                    type: 'video',
                    maxResults: 3,
                    order: 'relevance',
                    key: YOUTUBE_API_KEY
                }
            });

            if (youtubeResponse.data.items && youtubeResponse.data.items.length > 0) {
                const videos = youtubeResponse.data.items.map((item, index) => ({
                    id: index + 1,
                    title: item.snippet.title,
                    image: item.snippet.thumbnails.high.url,
                    source: "YouTube",
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
                }));

                return res.json({ videos });
            }
        }

        // If no YouTube API key or no results, return mock data
        res.json({
            videos: []
        });
    } catch (error) {
        console.error('Error fetching related videos:', error);
        res.status(500).json({
            error: 'Failed to fetch related videos',
            message: error.message
        });
    }
}

module.exports = {
    getVideos,
    getRelatedVideos,
    getRelatedVideosBattle
}