const express = require("express");
const cors = require("cors");
const { PORT } = require("./utils");
const app = express();
const matchRoutes = require('./routes/match')
const playerRoutes = require('./routes/player')
const newsRoutes = require('./routes/news')
const videoRoutes = require('./routes/video')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api/matches', matchRoutes)
app.use('/api/player', playerRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/videos', videoRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));