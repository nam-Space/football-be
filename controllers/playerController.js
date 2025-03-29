const { default: axios } = require("axios");
const { FOOTBALL_API_KEY, FOOTBALL_API_URL} = require("../utils");


const getPlayerDetail = async (req, res) => {
    try {
      const playerId = req.params.playerId
  
      // Lấy thông tin cầu thủ từ football-data.org
      const playerResponse = await axios.get(`${FOOTBALL_API_URL}/persons/${playerId}`, {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
      })
  
      const playerData = playerResponse.data
  
      if (!playerData) {
        return res.status(404).json({ error: "Player not found" })
      }
  
      // Gọi API TheSportsDB để lấy ảnh cầu thủ
      let playerImage = ""
      try {
        const sportsDbResponse = await axios.get(
          `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerData.name}`,
        )
  
        if (sportsDbResponse.data && sportsDbResponse.data.player) {
          playerImage = sportsDbResponse.data.player[0]?.strCutout || ""
        }
      } catch (error) {
        console.warn("Failed to fetch player image from TheSportsDB")
      }
  
      res.json({
        ...playerData,
        image: playerImage,
      })
    } catch (error) {
      console.error("Error fetching player details:", error)
      res.status(500).json({ error: error.message })
    }
  }
  
  const getPlayerStats = async (req, res) => {
    try {
      const playerId = req.params.playerId
  
      // Lấy thống kê cầu thủ từ football-data.org
      const statsResponse = await axios.get(`${FOOTBALL_API_URL}/persons/${playerId}/matches`, {
        headers: { "X-Auth-Token": FOOTBALL_API_KEY },
      })
  
      const statsData = statsResponse.data
  
      if (!statsData || !statsData.matches) {
        return res.status(404).json({ error: "No statistics found for this player" })
      }
  
      res.json(statsData.matches)
    } catch (error) {
      console.error("Error fetching player stats:", error)
      res.status(500).json({ error: error.message })
    }
  }

const getPlayerImage = async (req, res) => {
    try {
        const { playerName } = req.params;

        // Use TheSportsDB API to search for the player
        const searchUrl = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`;
        const response = await axios.get(searchUrl);

        // Check if any players were found
        if (response.data && response.data.player && response.data.player.length > 0) {
            // Get the first player's image
            const playerData = response.data.player[0];

            if (playerData.strThumb) {
                // Return the image URL as JSON
                return res.json({ imageUrl: playerData.strThumb });
            }
        }

        // If no image found, return a default avatar URL
        res.json({
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=37003C&color=fff&size=250`
        });
    } catch (error) {
        console.error('Error finding player image:', error.message);
        // Return a default avatar URL in case of error
        res.json({
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.params.playerName)}&background=37003C&color=fff&size=250`,
            error: error.message
        });
    }
}

module.exports = {
    getPlayerDetail,
    getPlayerStats,
    getPlayerImage
};

