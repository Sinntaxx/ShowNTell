const botToken = process.env.TELEGRAM_BOT_TOKEN;
const express = require('express');
const axios = require('axios');

const game = express.Router();

// example
game.get('/test', (req, res) => {
  res.sendStatus(200);
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
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(400);
      });
  } else {
    res.sendStatus(400);
  }
});

// url to have user click: https://telegram.me/GameAndWatchBot?start=${userId}
game.post('/notify', (req, res) => {
  const { name, updateTitle, link, chat_id, number } = req.body;
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
