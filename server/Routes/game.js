const express = require('express');
const axios = require('axios');

const game = express.Router();

// example
game.get('/test', (req, res) => {
  res.sendStatus(200);
});

// this endpoint will get games by a genre and take return the first 10.
game.get('/genre', (req, res) => {
  const config = {
    method: 'get',
    url: `http://steamspy.com/api.php?request=genre&genre=${req.body.genre}&page=1`,
    headers: { },
  };

  axios(config)
    .then((response) => {
      const top10Games = [];
      const keys = Object.keys(response.data);
      for (let i = 0; i < 10; i += 1) {
        top10Games.push(response.data[keys[i]]);
      }
      res.status(200).send(JSON.stringify(top10Games));
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send('Error in the request to the steam api');
    });
});

module.exports = game;
