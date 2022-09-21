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
    url: 'http://steamspy.com/api.php?request=genre&genre=Action&page=1',
    headers: { },
  };

  axios(config)
    .then((response) => {
      res.status(200).send(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = game;
