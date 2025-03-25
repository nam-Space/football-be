const { default: axios } = require("axios");
const { FOOTBALL_API_KEY, YOUTUBE_API_KEY } = require("../utils");

const getBattleByTeamId = async (req, res) => {
    try {
        const { homeTeamId, awayTeamId, date } = req.query;

        if (!homeTeamId || !awayTeamId) {
            return res.status(400).json({ error: 'Missing team IDs' });
        }

        // Get matches for the competition around the date
        const dateObj = new Date(date || new Date());
        const dateFrom = new Date(dateObj);
        dateFrom.setDate(dateFrom.getDate() - 3);
        const dateTo = new Date(dateObj);
        dateTo.setDate(dateTo.getDate() + 3);

        const fromStr = dateFrom.toISOString().split("T")[0];
        const toStr = dateTo.toISOString().split("T")[0];

        const response = await axios.get(
            `https://api.football-data.org/v4/competitions/2021/matches`,
            {
                params: {
                    dateFrom: fromStr,
                    dateTo: toStr
                },
                headers: {
                    'X-Auth-Token': FOOTBALL_API_KEY
                }
            }
        );

        // Find the specific match
        const foundMatch = response.data.matches.find(
            (m) =>
                (m.homeTeam.id === parseInt(homeTeamId) &&
                    m.awayTeam.id === parseInt(awayTeamId)) ||
                (m.homeTeam.id === parseInt(awayTeamId) &&
                    m.awayTeam.id === parseInt(homeTeamId))
        );

        if (foundMatch) {
            res.json(foundMatch);
        } else {
            // If no match found, try to get match by direct API call
            try {
                // Try to find a match between these teams in the past
                const historyResponse = await axios.get(
                    `https://api.football-data.org/v4/teams/${homeTeamId}/matches`,
                    {
                        params: {
                            status: 'FINISHED',
                            limit: 100
                        },
                        headers: {
                            'X-Auth-Token': FOOTBALL_API_KEY
                        }
                    }
                );

                const historyMatch = historyResponse.data.matches.find(
                    m => m.awayTeam.id === parseInt(awayTeamId) || m.homeTeam.id === parseInt(awayTeamId)
                );

                if (historyMatch) {
                    // Update the date to the requested date
                    historyMatch.utcDate = date ? new Date(date).toISOString() : new Date().toISOString();
                    res.json(historyMatch);
                } else {
                    throw new Error('No match history found');
                }
            } catch (historyError) {
                console.error('Error fetching match history:', historyError);
                res.status(404).json({ error: 'Match not found' });
            }
        }
    } catch (error) {
        console.error('Error fetching battle details:', error);
        res.status(500).json({
            error: 'Failed to fetch battle details',
            message: error.response?.data?.message || error.message
        });
    }
}

const getBattleById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.football-data.org/v4/matches/${id}`, {
            headers: {
                'X-Auth-Token': FOOTBALL_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching battle details by ID:', error);
        res.status(500).json({
            error: 'Failed to fetch battle details',
            message: error.response?.data?.message || error.message
        });
    }
}

const getBattleStatisticById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to get the match first to see if it exists
        const matchResponse = await axios.get(`https://api.football-data.org/v4/matches/${id}`, {
            headers: {
                'X-Auth-Token': FOOTBALL_API_KEY
            }
        });

        // If match exists, create stats based on the score
        const match = matchResponse.data;
        const homeScore = match.score?.fullTime?.home || 0;
        const awayScore = match.score?.fullTime?.away || 0;

        // Generate realistic stats based on the score
        const homeAdvantage = Math.random() * 10 + 5; // 5-15% home advantage
        const totalPossession = 100;
        const homePossession = Math.min(Math.max(Math.round(50 + homeAdvantage + (homeScore - awayScore) * 5), 30), 70);
        const awayPossession = totalPossession - homePossession;

        const homeShots = Math.round(homeScore * 3 + Math.random() * 10);
        const awayShots = Math.round(awayScore * 3 + Math.random() * 10);

        const homeShotsOnTarget = Math.min(homeShots, Math.max(homeScore, Math.round(homeShots * 0.4)));
        const awayShotsOnTarget = Math.min(awayShots, Math.max(awayScore, Math.round(awayShots * 0.4)));

        res.json({
            matchId: id,
            stats: {
                possession: {
                    home: homePossession,
                    away: awayPossession
                },
                shots: {
                    home: homeShots,
                    away: awayShots
                },
                shotsOnTarget: {
                    home: homeShotsOnTarget,
                    away: awayShotsOnTarget
                },
                touches: {
                    home: Math.round(homePossession * 6),
                    away: Math.round(awayPossession * 6)
                },
                passes: {
                    home: Math.round(homePossession * 5),
                    away: Math.round(awayPossession * 5)
                },
                tackles: {
                    home: Math.round(Math.random() * 20 + 10),
                    away: Math.round(Math.random() * 20 + 10)
                },
                clearances: {
                    home: Math.round(Math.random() * 15 + 5),
                    away: Math.round(Math.random() * 15 + 5)
                },
                corners: {
                    home: Math.round(Math.random() * 8 + 2),
                    away: Math.round(Math.random() * 8 + 2)
                },
                offsides: {
                    home: Math.round(Math.random() * 4),
                    away: Math.round(Math.random() * 4)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching battle stats:', error);
        res.status(500).json({
            error: 'Failed to fetch battle stats',
            message: error.response?.data?.message || error.message
        });
    }
}

const getBattleStatisticByTeamId = async (req, res) => {
    try {
        const { homeTeamId, awayTeamId } = req.query;

        if (!homeTeamId || !awayTeamId) {
            return res.status(400).json({ error: 'Missing team IDs' });
        }

        // Generate realistic stats
        const homePossession = Math.round(Math.random() * 40 + 30); // 30-70%
        const awayPossession = 100 - homePossession;

        res.json({
            stats: {
                possession: {
                    home: homePossession,
                    away: awayPossession
                },
                shotsOnTarget: {
                    home: Math.round(Math.random() * 10 + 2),
                    away: Math.round(Math.random() * 10 + 2)
                },
                shots: {
                    home: Math.round(Math.random() * 15 + 5),
                    away: Math.round(Math.random() * 15 + 5)
                },
                touches: {
                    home: Math.round(homePossession * 6),
                    away: Math.round(awayPossession * 6)
                },
                passes: {
                    home: Math.round(homePossession * 5),
                    away: Math.round(awayPossession * 5)
                },
                tackles: {
                    home: Math.round(Math.random() * 20 + 10),
                    away: Math.round(Math.random() * 20 + 10)
                },
                clearances: {
                    home: Math.round(Math.random() * 15 + 5),
                    away: Math.round(Math.random() * 15 + 5)
                },
                corners: {
                    home: Math.round(Math.random() * 8 + 2),
                    away: Math.round(Math.random() * 8 + 2)
                },
                offsides: {
                    home: Math.round(Math.random() * 4),
                    away: Math.round(Math.random() * 4)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching battle stats by team IDs:', error);
        res.status(500).json({
            error: 'Failed to fetch battle stats',
            message: error.message
        });
    }
}

const getBattleReportById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the match details to generate a realistic report
        const matchResponse = await axios.get(`https://api.football-data.org/v4/matches/${id}`, {
            headers: {
                'X-Auth-Token': FOOTBALL_API_KEY
            }
        });

        const match = matchResponse.data;
        const homeTeamName = match.homeTeam.name;
        const awayTeamName = match.awayTeam.name;
        const homeScore = match.score?.fullTime?.home || 0;
        const awayScore = match.score?.fullTime?.away || 0;

        // Generate a report based on the score
        let report = "";
        if (homeScore > awayScore) {
            report = `${homeTeamName} secured a ${homeScore}-${awayScore} victory over ${awayTeamName} in an exciting Premier League clash. The home team dominated possession and created numerous chances throughout the match. ${homeTeamName}'s defense held firm against ${awayTeamName}'s attacks, allowing them to claim all three points.`;
        } else if (awayScore > homeScore) {
            report = `${awayTeamName} claimed a ${awayScore}-${homeScore} win against ${homeTeamName} in a thrilling Premier League encounter. The away side showed great resilience and tactical awareness to overcome the home advantage. ${homeTeamName} had their chances but couldn't capitalize against a well-organized ${awayTeamName} defense.`;
        } else {
            report = `${homeTeamName} and ${awayTeamName} shared the spoils in a ${homeScore}-${awayScore} draw after an evenly contested Premier League match. Both teams had opportunities to win the game but couldn't find a decisive goal. The result was a fair reflection of the balance of play.`;
        }

        res.json({ report });
    } catch (error) {
        console.error('Error fetching battle report:', error);
        res.status(500).json({
            error: 'Failed to fetch battle report',
            message: error.response?.data?.message || error.message
        });
    }
}

const getBattleReportByTeamId = async (req, res) => {
    try {
        const { homeTeamId, awayTeamId } = req.query;

        if (!homeTeamId || !awayTeamId) {
            return res.status(400).json({ error: 'Missing team IDs' });
        }

        // Get team names
        const [homeTeamResponse, awayTeamResponse] = await Promise.all([
            axios.get(`https://api.football-data.org/v4/teams/${homeTeamId}`, {
                headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
            }),
            axios.get(`https://api.football-data.org/v4/teams/${awayTeamId}`, {
                headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
            })
        ]);

        const homeTeamName = homeTeamResponse.data.name;
        const awayTeamName = awayTeamResponse.data.name;

        // Generate a random score
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 4);

        // Generate a report based on the score
        let report = "";
        if (homeScore > awayScore) {
            report = `${homeTeamName} secured a ${homeScore}-${awayScore} victory over ${awayTeamName} in an exciting Premier League clash. The home team dominated possession and created numerous chances throughout the match. ${homeTeamName}'s defense held firm against ${awayTeamName}'s attacks, allowing them to claim all three points.`;
        } else if (awayScore > homeScore) {
            report = `${awayTeamName} claimed a ${awayScore}-${homeScore} win against ${homeTeamName} in a thrilling Premier League encounter. The away side showed great resilience and tactical awareness to overcome the home advantage. ${homeTeamName} had their chances but couldn't capitalize against a well-organized ${awayTeamName} defense.`;
        } else {
            report = `${homeTeamName} and ${awayTeamName} shared the spoils in a ${homeScore}-${awayScore} draw after an evenly contested Premier League match. Both teams had opportunities to win the game but couldn't find a decisive goal. The result was a fair reflection of the balance of play.`;
        }

        res.json({ report });
    } catch (error) {
        console.error('Error fetching battle report by team IDs:', error);
        res.status(500).json({
            error: 'Failed to fetch battle report',
            message: error.message
        });
    }
}

const getBattleCommentaryByBattleId = async (req, res) => {
    try {
        const { id } = req.params;

        // Get the match details to generate realistic commentary
        const matchResponse = await axios.get(`https://api.football-data.org/v4/matches/${id}`, {
            headers: {
                'X-Auth-Token': FOOTBALL_API_KEY
            }
        });

        const match = matchResponse.data;
        const homeTeamName = match.homeTeam.name;
        const awayTeamName = match.awayTeam.name;
        const homeScore = match.score?.fullTime?.home || 0;
        const awayScore = match.score?.fullTime?.away || 0;

        // Generate commentary based on the match
        const commentary = [];
        let commentId = 1;

        // Add final whistle
        commentary.push({
            id: commentId++,
            time: "90'+4",
            event: "Full Time! The match ends.",
            team: "Referee"
        });

        // Add goals based on the score
        for (let i = 0; i < homeScore; i++) {
            const minute = Math.floor(Math.random() * 85) + 5;
            commentary.push({
                id: commentId++,
                time: `${minute}'`,
                event: "GOAL! Great finish!",
                team: homeTeamName
            });
        }

        for (let i = 0; i < awayScore; i++) {
            const minute = Math.floor(Math.random() * 85) + 5;
            commentary.push({
                id: commentId++,
                time: `${minute}'`,
                event: "GOAL! Excellent strike!",
                team: awayTeamName
            });
        }

        // Add some random events
        const events = [
            "Yellow Card",
            "Corner kick",
            "Shot on target",
            "Shot off target",
            "Substitution",
            "Free kick in a dangerous position",
            "Offside"
        ];

        for (let i = 0; i < 15; i++) {
            const minute = Math.floor(Math.random() * 90) + 1;
            const team = Math.random() > 0.5 ? homeTeamName : awayTeamName;
            const event = events[Math.floor(Math.random() * events.length)];

            commentary.push({
                id: commentId++,
                time: `${minute}'`,
                event,
                team
            });
        }

        // Sort by time (descending)
        commentary.sort((a, b) => {
            const timeA = parseInt(a.time.replace(/\D/g, ''));
            const timeB = parseInt(b.time.replace(/\D/g, ''));
            return timeB - timeA;
        });

        res.json({ commentary });
    } catch (error) {
        console.error('Error fetching battle commentary:', error);
        res.status(500).json({
            error: 'Failed to fetch battle commentary',
            message: error.response?.data?.message || error.message
        });
    }
}

const getBattleCommentaryByTeamId = async (req, res) => {
    try {
        const { homeTeamId, awayTeamId } = req.query;

        // Get team names if IDs are provided
        let homeTeamName = "Home Team";
        let awayTeamName = "Away Team";

        if (homeTeamId && awayTeamId) {
            try {
                const [homeTeamResponse, awayTeamResponse] = await Promise.all([
                    axios.get(`https://api.football-data.org/v4/teams/${homeTeamId}`, {
                        headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
                    }),
                    axios.get(`https://api.football-data.org/v4/teams/${awayTeamId}`, {
                        headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
                    })
                ]);

                homeTeamName = homeTeamResponse.data.name;
                awayTeamName = awayTeamResponse.data.name;
            } catch (teamError) {
                console.error('Error fetching team names:', teamError);
            }
        }

        // Generate commentary
        const commentary = [];
        for (let i = 0; i < 10; i++) {
            commentary.push({
                id: i + 1,
                time: "90'+8",
                event: `Corner, ${homeTeamName}. Conceded by Player ${Math.floor(Math.random() * 11) + 1}.`,
                team: homeTeamName
            });
        }

        res.json({ commentary });
    } catch (error) {
        console.error('Error fetching battle commentary by team IDs:', error);
        res.status(500).json({
            error: 'Failed to fetch battle commentary',
            message: error.message
        });
    }
}

const getBattleHighlightByTeamId = async (req, res) => {
    try {
        const { homeTeamId, awayTeamId } = req.query;

        if (!homeTeamId || !awayTeamId) {
            return res.status(400).json({ error: 'Missing team IDs' });
        }

        // Get team names for better search results
        const [homeTeamResponse, awayTeamResponse] = await Promise.all([
            axios.get(`https://api.football-data.org/v4/teams/${homeTeamId}`, {
                headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
            }),
            axios.get(`https://api.football-data.org/v4/teams/${awayTeamId}`, {
                headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
            })
        ]);

        const homeTeamName = homeTeamResponse.data.name;
        const awayTeamName = awayTeamResponse.data.name;

        // Use YouTube API to get highlights if you have a key
        if (YOUTUBE_API_KEY) {
            const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: `${homeTeamName} vs ${awayTeamName} highlights`,
                    type: 'video',
                    maxResults: 2,
                    order: 'relevance',
                    key: YOUTUBE_API_KEY
                }
            });

            const highlights = youtubeResponse.data.items.map((item, index) => ({
                id: index + 1,
                title: item.snippet.title,
                image: item.snippet.thumbnails.high.url,
                source: "YouTube",
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`
            }));

            return res.json({ highlights });
        }

        // If no YouTube API key, return mock data
        res.json({
            highlights: [
                {
                    id: 1,
                    title: `HIGHLIGHTS: ${homeTeamName} vs ${awayTeamName} | Premier League`,
                    image: `https://picsum.photos/seed/${homeTeamName}-${awayTeamName}-1/500/300`,
                    source: "YouTube",
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${homeTeamName} vs ${awayTeamName} highlights`)}`
                },
                {
                    id: 2,
                    title: `HIGHLIGHTS: ${homeTeamName} vs ${awayTeamName} | Premier League`,
                    image: `https://picsum.photos/seed/${homeTeamName}-${awayTeamName}-2/500/300`,
                    source: "YouTube",
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${homeTeamName} vs ${awayTeamName} highlights`)}`
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching battle highlights:', error);

        // Return mock data if API fails
        res.json({
            highlights: [
                {
                    id: 1,
                    title: "HIGHLIGHTS: Premier League Match | Football Highlights",
                    image: "https://picsum.photos/seed/highlight1/500/300",
                    source: "YouTube",
                    url: "https://www.youtube.com/results?search_query=premier+league+highlights"
                },
                {
                    id: 2,
                    title: "HIGHLIGHTS: Premier League Match | Football Highlights",
                    image: "https://picsum.photos/seed/highlight2/500/300",
                    source: "YouTube",
                    url: "https://www.youtube.com/results?search_query=premier+league+highlights"
                }
            ]
        });
    }
}

const getBattleHeadToHeadByTeamId = async (req, res) => {
    try {
        const { team1, team2 } = req.query;

        if (!team1 || !team2) {
            return res.status(400).json({ error: 'Missing team IDs' });
        }

        // Try to get real head-to-head data
        try {
            const response = await axios.get(
                `https://api.football-data.org/v4/teams/${team1}/matches`,
                {
                    params: {
                        status: 'FINISHED',
                        limit: 100
                    },
                    headers: {
                        'X-Auth-Token': FOOTBALL_API_KEY
                    }
                }
            );

            // Filter matches against team2
            const h2hMatches = response.data.matches.filter(
                m => m.awayTeam.id === parseInt(team2) || m.homeTeam.id === parseInt(team2)
            );

            if (h2hMatches.length > 0) {
                // Calculate stats
                let homeWins = 0;
                let awayWins = 0;
                let draws = 0;
                let homeGoals = 0;
                let awayGoals = 0;

                h2hMatches.forEach(match => {
                    const isTeam1Home = match.homeTeam.id === parseInt(team1);
                    const homeScore = match.score.fullTime.home;
                    const awayScore = match.score.fullTime.away;

                    if (isTeam1Home) {
                        homeGoals += homeScore;
                        awayGoals += awayScore;

                        if (homeScore > awayScore) homeWins++;
                        else if (homeScore < awayScore) awayWins++;
                        else draws++;
                    } else {
                        homeGoals += awayScore;
                        awayGoals += homeScore;

                        if (homeScore < awayScore) homeWins++;
                        else if (homeScore > awayScore) awayWins++;
                        else draws++;
                    }
                });

                // Get team names
                const [team1Response, team2Response] = await Promise.all([
                    axios.get(`https://api.football-data.org/v4/teams/${team1}`, {
                        headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
                    }),
                    axios.get(`https://api.football-data.org/v4/teams/${team2}`, {
                        headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
                    })
                ]);

                const team1Name = team1Response.data.name;
                const team2Name = team2Response.data.name;
                const team1Tla = team1Response.data.tla || team1Name.substring(0, 3).toUpperCase();
                const team2Tla = team2Response.data.tla || team2Name.substring(0, 3).toUpperCase();

                // Format previous results
                const previousResults = h2hMatches.slice(0, 3).map(match => {
                    const matchDate = new Date(match.utcDate);
                    const isTeam1Home = match.homeTeam.id === parseInt(team1);

                    return {
                        date: `${matchDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}`,
                        homeTeam: isTeam1Home ? team1Tla : team2Tla,
                        homeScore: match.score.fullTime.home,
                        awayTeam: isTeam1Home ? team2Tla : team1Tla,
                        awayScore: match.score.fullTime.away
                    };
                });

                // Generate form guide
                const formGuide = [];
                for (let i = 0; i < 5; i++) {
                    formGuide.push({
                        home: `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 3)} v ${['SOU', 'WHU', 'ARS', 'CHE', 'MCI', 'LIV', 'TOT', 'NEW', 'CRY', 'BOU'][Math.floor(Math.random() * 10)]} (${Math.random() > 0.5 ? 'H' : 'A'})`,
                        away: `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 3)} v ${['SOU', 'WHU', 'ARS', 'CHE', 'MCI', 'LIV', 'TOT', 'NEW', 'CRY', 'BOU'][Math.floor(Math.random() * 10)]} (${Math.random() > 0.5 ? 'H' : 'A'})`
                    });
                }

                // Generate season stats
                const seasonStats = {
                    position: {
                        home: Math.floor(Math.random() * 10) + 1,
                        away: Math.floor(Math.random() * 10) + 1
                    },
                    won: {
                        home: Math.floor(Math.random() * 15) + 5,
                        away: Math.floor(Math.random() * 15) + 5
                    },
                    draw: {
                        home: Math.floor(Math.random() * 10) + 1,
                        away: Math.floor(Math.random() * 10) + 1
                    },
                    lost: {
                        home: Math.floor(Math.random() * 10) + 1,
                        away: Math.floor(Math.random() * 10) + 1
                    },
                    avgGoalsScored: {
                        home: (Math.random() * 2 + 1).toFixed(1),
                        away: (Math.random() * 2 + 1).toFixed(1)
                    },
                    avgGoalsConceded: {
                        home: (Math.random() * 1.5 + 0.5).toFixed(1),
                        away: (Math.random() * 1.5 + 0.5).toFixed(1)
                    }
                };

                return res.json({
                    headToHead: {
                        played: h2hMatches.length,
                        homeWins,
                        draws,
                        awayWins,
                        homeGoals,
                        awayGoals
                    },
                    previousResults,
                    formGuide,
                    seasonStats
                });
            }
        } catch (apiError) {
            console.error('Error fetching head-to-head data from API:', apiError);
        }

        // If we get here, either no matches were found or there was an API error
        // Generate mock data
        const randomNumber = () => Math.floor(Math.random() * 20);

        const headToHead = {
            played: 19,
            homeWins: randomNumber(),
            draws: 10,
            awayWins: randomNumber(),
            homeGoals: randomNumber(),
            awayGoals: randomNumber()
        };

        // Generate previous results
        const generatePreviousResults = () => {
            const results = [];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            for (let i = 0; i < 3; i++) {
                const month = months[Math.floor(Math.random() * months.length)];
                const day = Math.floor(Math.random() * 28) + 1;

                results.push({
                    date: `Saturday ${day} ${month}`,
                    homeTeam: "Leicester",
                    homeScore: Math.floor(Math.random() * 4),
                    awayTeam: "Man",
                    awayScore: Math.floor(Math.random() * 4)
                });
            }

            return results;
        };

        // Generate form guide
        const generateFormGuide = () => {
            const forms = [];
            const opponents = ["ARS", "CHE", "MCI", "LIV", "TOT", "WHU", "EVE", "NEW", "CRY", "BOU", "SOU"];

            for (let i = 0; i < 5; i++) {
                const homeOpp = opponents[Math.floor(Math.random() * opponents.length)];
                const awayOpp = opponents[Math.floor(Math.random() * opponents.length)];
                const homeScore = Math.floor(Math.random() * 4);
                const homeConc = Math.floor(Math.random() * 4);
                const awayScore = Math.floor(Math.random() * 4);
                const awayConc = Math.floor(Math.random() * 4);

                forms.push({
                    home: `${homeScore}-${homeConc} v ${homeOpp} (H)`,
                    away: `${awayScore}-${awayConc} v ${awayOpp} (A)`
                });
            }

            return forms;
        };

        // Generate season stats
        const seasonStats = {
            position: {
                home: Math.floor(Math.random() * 10) + 1,
                away: Math.floor(Math.random() * 10) + 1
            },
            won: {
                home: Math.floor(Math.random() * 15) + 5,
                away: Math.floor(Math.random() * 15) + 5
            },
            draw: {
                home: Math.floor(Math.random() * 10) + 1,
                away: Math.floor(Math.random() * 10) + 1
            },
            lost: {
                home: Math.floor(Math.random() * 10) + 1,
                away: Math.floor(Math.random() * 10) + 1
            },
            avgGoalsScored: {
                home: (Math.random() * 2 + 1).toFixed(1),
                away: (Math.random() * 2 + 1).toFixed(1)
            },
            avgGoalsConceded: {
                home: (Math.random() * 1.5 + 0.5).toFixed(1),
                away: (Math.random() * 1.5 + 0.5).toFixed(1)
            }
        };

        res.json({
            headToHead,
            previousResults: generatePreviousResults(),
            formGuide: generateFormGuide(),
            seasonStats
        });
    } catch (error) {
        console.error('Error fetching head-to-head data:', error);
        res.status(500).json({
            error: 'Failed to fetch head-to-head data',
            message: error.message
        });
    }
}

const getBattleLineupById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1) Lấy thông tin trận đấu để biết homeTeamId, awayTeamId
        //    (Hoặc bạn đã có sẵn match.homeTeam.id, match.awayTeam.id)
        const matchResponse = await axios.get(
            `https://api.football-data.org/v4/matches/${id}`,
            {
                headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
            }
        );
        const match = matchResponse.data;

        const homeTeamId = match.homeTeam.id;
        const awayTeamId = match.awayTeam.id;

        // 2) Hàm gọi lên /v4/teams/:teamId để lấy "squad"
        async function getSquad(teamId) {
            const teamRes = await axios.get(
                `https://api.football-data.org/v4/teams/${teamId}`,
                {
                    headers: { 'X-Auth-Token': FOOTBALL_API_KEY }
                }
            );
            // tuỳ theo gói API, "squad" có thể rỗng
            return teamRes.data.squad || [];
        }

        // 3) Lấy squad 2 đội
        let homeSquad = await getSquad(homeTeamId);
        let awaySquad = await getSquad(awayTeamId);

        // Nếu free-tier API không trả "squad", bạn có thể fallback:
        if (!homeSquad) {
            // fallback cứng, hoặc mock data tuỳ bạn
            homeSquad = [
                { name: 'GK A', position: 'Goalkeeper' },
                { name: 'DF B', position: 'Defender' },
                { name: 'DF C', position: 'Defender' },
                { name: 'MF D', position: 'Midfielder' },
                // ...
                // Tối thiểu 20 người để tách 11 + 9
            ];
        }
        if (!awaySquad) {
            // fallback cứng
            awaySquad = [
                { name: 'GK X', position: 'Goalkeeper' },
                { name: 'DF Y', position: 'Defender' },
                // ...
            ];
        }

        // 4) Hàm shuffle mảng:
        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        // 5) Tạo hàm pickLineup (để xáo trộn + tách 11 người đá chính, 9 người dự bị)
        function pickLineup(fullSquad) {
            // Xáo trộn
            // shuffleArray(fullSquad);

            // Lấy 11 cầu thủ đầu làm đá chính
            const startingXI = fullSquad.slice(0, 11);

            // 9 cầu thủ tiếp theo làm dự bị (hoặc tuỳ ý)
            const substitutes = fullSquad.slice(11, 20);

            return {
                formation: "4-3-3", // Bạn có thể tính logic tuỳ ý
                startingXI,
                substitutes
            };
        }

        const homeLineup = pickLineup(homeSquad);
        const awayLineup = pickLineup(awaySquad);

        // 6) Trả về client
        res.json({
            homeTeam: homeLineup,
            awayTeam: awayLineup
        });
    } catch (error) {
        console.error('Error fetching lineup:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch lineup',
            message: error.message
        });
    }
}

module.exports = {
    getBattleByTeamId,
    getBattleById,
    getBattleStatisticById,
    getBattleStatisticByTeamId,
    getBattleReportById,
    getBattleReportByTeamId,
    getBattleCommentaryByBattleId,
    getBattleCommentaryByTeamId,
    getBattleHighlightByTeamId,
    getBattleHeadToHeadByTeamId,
    getBattleLineupById
}