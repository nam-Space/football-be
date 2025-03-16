const express = require("express");
const cors = require("cors");
const { PORT, FOOTBALL_API_KEY } = require("./utils");
const app = express();
const userRoutes = require('./routes/user')
const matchRoutes = require('./routes/match')
const playerRoutes = require('./routes/player')
const newsRoutes = require('./routes/news')
const videoRoutes = require('./routes/video');
const teamRoutes = require('./routes/team');
const competitionRoutes = require('./routes/competition');
const cookieParser = require("cookie-parser");
const dbConnect = require("./db/dbConnect");
const { default: axios } = require("axios");

require("dotenv").config();
dbConnect();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/competitions', competitionRoutes)


app.get("/", (request, response) => {
    response.status(200).json({ message: "Hello from Football App API!" });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));