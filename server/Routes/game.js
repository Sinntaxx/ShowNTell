const botToken = process.env.TELEGRAM_BOT_TOKEN;
const express = require('express');
const axios = require('axios');
const { json } = require('body-parser');
const { Users, Games, Notifications } = require('../db/schema.js');

const game = express.Router();

// save game in database
const saveGame = async (game) => {
  // game is formatted from steam store api for db
  const dbGame = {
    id: game.steam_appid,
    description: game.detailed_description,
    short_desc: game.short_description,
    about: game.about_the_game,
    header_image: game.header_image,
    requirements: game.pc_requirements,
    developers: game.developers,
    price: game.price_overview,
    package: game.package_groups.subs,
    platforms: game.platforms,
    categories: game.categories,
    genres: game.genres,
    screenshots: game.screenshots,
    movies: game.movies,
    achievements: [],
    release_date: game.release_date,
    user_reviews: [],
    most_recent_update: '',
  };
  try {
    const { data } = await axios.get(`https://api.achievementstats.com/games/${dbGame.id}/achievements/?key=${process.env.STEAM_ACHIEVE_KEY}`);

    const achievs = data.map((ach) => {
      return {
        name: ach.name,
        desc: ach.description,
        imgLocked: `https://www.achievementstats.com/${ach.iconLocked}`,
        imgUnlocked: `https://www.achievementstats.com/${ach.iconUnlocked}`,
      };
    });
    dbGame.achievements = achievs;
    await Games.create(dbGame);
    return 'database Game created!';
  } catch (err) {
    console.error('error getting achievements\n', err);
  }
};

// testing saveGame with request, remove later
game.post('/newgame', (req, res) => {
  const newGame = req.body;
  return saveGame(newGame)
    .then((data) => {
      console.log('data returned\n', data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('error on request\n', err);
      res.sendStatus(500);
    });
});

// find games by name
game.get('/byname/:name', (req, res) => {
  console.log('name from parameters', req.params);
  const { name } = req.params;
  axios
    .get(`https://steamcommunity.com/actions/SearchApps/${name}`)
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

// path to get all achievements for a individual user;
//  game.get('/user/achievements/:userId')

// this endpoint will get games by a genre and take return the first 10.
game.post('/genre', (req, res) => {
  const config = {
    method: 'get',
    url: `http://steamspy.com/api.php?request=genre&genre=${req.body.genre}&page=1`,
    headers: {},
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

// Url for getting news about a game by its id:  http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${game.id}&count=5&format=json
// Endpoint for finding out if any games have been updated
game.get('/updates', (req, res) => {
  let allPatchNotes;
  let notifications;
  Notifications.find({})
    .then((notifs) => {
      console.log('notifs: ', notifs);
      notifications = notifs;
      // Might be able to use just promise.all without promise.resolve
      return Promise.resolve(
        Promise.all(
          notifs.map((notif) => axios.post(
            `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${notif.gameId}&count=10&format=json`,
          )),
        ),
      );
    })
    .then((allNews) => {
      console.log('allNews: ', allNews);
      allPatchNotes = allNews.map((gameNews) => {
        gameNews.appNews.newsItems = gameNews.appNews.newsItems.filter(
          (news) => news.tags && news.tags.includes('patchnotes'),
        );
        return gameNews;
      });
      return Promise.resolve(
        Promise.all(
          allPatchNotes.map((patchNotes) => Games.findOne({ id: patchNotes.appNews.appid })),
        ),
      );
    })
    .then((games) => {
      console.log('games: ', games);
      games.forEach((game, i) => {
        if (
          game.most_recent_update.title
          !== allPatchNotes[i].appNews.newsItems[0].title
        ) {
          game.most_recent_update = allPatchNotes[i].appNews.newsItems[0].title;
          Games.findOneAndUpdate(game, game);
          notifications.forEach((notification) => Users.findOne({ id: notification.userId })
            .then((user) => {
              console.log('user: ', user);
              return Promise.resolve(Promise.all(notifications.map((noti) => {
                if (noti.gameId === game.id && noti.userId === user.id) {
                  const text = `**New Update**\n${game.name}\n${game.most_recent_update.title}\n${game.url}`;
                  return axios.post(
                    `https://api.telegram.org/bot${botToken}/sendMessage`,
                    {
                      chat_id: user.chatId,
                      text,
                    },
                  );
                }
                return null;
              }).filter((a) => a !== null)));
            })
            .then(() => {
              res.sendStatus(200);
            }));
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
// testing
game.get('/subscribe', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId })
    .then((userInfo) => {
      Promise.all(userInfo.gameSubscriptions.map((game) => Games.findOne({ id: game })))
        .then((results) => {
          const g = [];
          results.forEach((result) => result.genres.forEach((genre) => g.push(genre.description)));
          res.status(200).send(g[(Math.floor(Math.random() * ((g.length - 1) - 0 + 1)) + 0)]);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).send('error on the server');
        });
    });
});

module.exports = game;
