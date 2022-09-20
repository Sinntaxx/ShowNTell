const express = require('express');

const game = express.Router();

// example
game.get('/test', (req, res) => {
  res.sendStatus(200);
});

module.exports = game;
