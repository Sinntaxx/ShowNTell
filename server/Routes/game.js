const express = require('express');
const axios = require('axios');
const { Games } = require('../db/schema.js');

const game = express.Router();

game.get('/:name', (req, res) => {
  console.log('name from parameters', req.params);
  const { name } = req.params;
  axios.get(`https://steamcommunity.com/actions/SearchApps/${name}`)
    .then(({ data }) => {
      if (!data.length) {
        res.sendStatus(404);
      }
      if (data.length > 1) {
        // return data.map((game) => {
        //   return axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}`)
        // })
      }
      const gameId = data[0].appid;
      // console.log('gameobj from steam\n', data, '\n\ngameid returned from api', gameId);
      axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}`)
        .then(({ data }) => {
          const game = data[gameId].data;
          console.log('data returned from store api', game);
        })
        .catch((err) => {
          console.error('error getting data by id\n', err);
        });
    })
    .catch((err) => {
      console.error('error requesting app id by name\n', err);
      res.sendStatus(500);
    });
});

module.exports = game;
