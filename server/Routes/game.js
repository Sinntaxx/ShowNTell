const botToken = process.env.TELEGRAM_BOT_TOKEN;
const express = require('express');
const axios = require('axios');
const { Users } = require('../db/schema.js');

const game = express.Router();

game.get('/byname/:name', (req, res) => {
  console.log('name from parameters', req.params);
  const { name } = req.params;
  axios.get(`https://steamcommunity.com/actions/SearchApps/${name}`)
    .then(({ data }) => {
      if (!data.length) {
        res.sendStatus(404);
      }

      const gameIds = data.map((game) => {
        const gameId = game.appid;
        return axios.get(`https://store.steampowered.com/api/appdetails?appids=${gameId}`)
          .then(({ data }) => {
            const gameObj = data[gameId].data;
            return gameObj;
          })
          .catch((err) => {
            console.error('error on request\n', err);
          });
      });
      return gameIds;
    })
    .then((promiseArr) => {
      // console.log('array of promises?\n\n', promiseArr);
      const theTruth = Promise.resolve(Promise.all(promiseArr));
      return theTruth
        .then((data) => {
          console.log('theTruths data\n', data);
          res.sendStatus(200);
        })
        .catch((err) => {
          console.error('error on request\n', err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error('error requesting app id by name\n', err);
      res.sendStatus(500);
    });
});

// this endpoint will get games by a genre and take return the first 10.
game.post('/genre', (req, res) => {
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
// url to notify webpage that a user has started a chat with the bot: https://${siteUrl}/game/newUser
game.post('/newUser', (req, res) => {
  const { message } = req.body;
  if (message.text.split(' ')[0] === '/start') {
    // This is the user token to associate the user in the database with the user on telegram
    const userToken = message.text.split(' ')[1];
    const chatId = message.chat.id;
    axios
      .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: 'You are now subscribed to notifications from Game&Watch',
      })
      .then()
      .then(() => {
        return Users.findOneAndUpdate({ id: userToken }, { chatId });
      })
      .then((result) => {
        console.log(result);
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  } else {
    res.sendStatus(200);
  }
});

// url to have user click: https://telegram.me/GameAndWatchBot?start=${userId}
game.post('/notify', (req, res) => {
  const { name, updateTitle, link, chat_id } = req.body;
  const text = `**New Update**\n${name}\n${updateTitle}\n${link}`;
  axios
    .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id,
      text,
    })
    .then((result) => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});

module.exports = game;
