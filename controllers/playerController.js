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

module.exports = {
    getPlayerDetail,
    getPlayerStats,
}
