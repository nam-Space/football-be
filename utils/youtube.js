// Helper function to format YouTube duration (ISO 8601 duration to readable format)
function formatYouTubeDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (match[1] && match[1].replace('H', '')) || 0;
    const minutes = (match[2] && match[2].replace('M', '')) || 0;
    const seconds = (match[3] && match[3].replace('S', '')) || 0;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper function to format view count
function formatViewCount(viewCount) {
    const count = parseInt(viewCount);

    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M views`;
    }

    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K views`;
    }

    return `${count} views`;
}

module.exports = {
    formatYouTubeDuration,
    formatViewCount
}