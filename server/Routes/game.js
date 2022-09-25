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
    name: game.name,
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
    most_recent_update: { title: '', url: '' },
  };
  try {
    const check = await Games.find({ id: dbGame.id });

    if (check.length) {
      // console.error('already found in database!');
      return check;
    }
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
    return dbGame;
  } catch (err) {
    console.error('error getting achievements\n', err);
  }
};

// testing saveGame with request, remove later
game.post('/newgame', (req, res) => {
  const newGame = req.body;
  return saveGame(newGame)
    .then((data) => {
      // console.log('data returned\n', data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error('error on request\n', err);
      res.sendStatus(500);
    });
});

// get a single game by id
game.get('/byId/:gameId', (req, res) => {
  const { gameId } = req.params;
  const id = Number(gameId);
  Games.findOne({ id })
    .then((game) => {
      console.log('achievements\n', game);
      res.status(200).send(game);
    })
    .catch((err) => {
      console.error('error on finding game byId\n', err);
      res.sendStatus(500);
    });
});

// find games by name and save to db
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
            // console.log('game object\n', gameObj)
            return saveGame(gameObj);
          })
          .then((data) => {
            // console.log('data returned from saveGame\n', data);
            return data;
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
          const games = data.flat();
          // console.log(games);
          res.status(200).send(games);
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

// get all of users gameSubscriptions
game.get('/subscriptions/:userId', (req, res) => {
  const { userId } = req.params;
  const id = Number(userId);

  Users.findOne({ id })
    .then(({ gameSubscriptions }) => {
    // console.log('user gameSubs from db', gameSubscriptions);
      res.status(200).send(gameSubscriptions);
    })
    .catch((err) => {
      console.error('error on finding user\n', err);
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

      Promise.all(top10Games.map((game) => {
        const getGameInfo = {
          method: 'get',
          url: `https://store.steampowered.com/api/appdetails?appids=${game.appid}`,
          headers: {},
        };
        return axios(getGameInfo);
      }))
        .then((gamesInfo) => res.status(201).send(JSON.stringify(gamesInfo.map((gameInfo, i) => gameInfo.data[top10Games[i].appid].data))))
        .catch((err) => {
          console.log(err);
          res.status(404).send('Error in the request to the steam api');
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send('Error in the request to the steam api');
    });
});

// url to notify webpage that a user has started a chat with the bot: https://${siteUrl}/game/newUser
game.post('/newUser', (req, res) => {
  const { message } = req.body;
  if (message.text && message.text.split(' ')[0] === '/start') {
    // This is the user token to associate the user in the database with the user on telegram
    const userToken = message.text.split(' ')[1];
    const chatId = message.chat.id;
    axios
      .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: 'You are now subscribed to notifications from Game&Watch',
      })
      .then(() => {
        return Users.findOneAndUpdate({ id: userToken }, { chatId, notifs: true });
      })
      .then((result) => {
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
// Endpoint for finding out if any games have been updated and notifying subscribed users
game.post('/updates', (req, res) => {
  let allPatchNotes;
  Users.find({ notifs: true }).then((users) => {
    Games.find({})
      .then((games) => {
        return Promise.all(
          games.map((game) => axios
            .get(
              `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${game.id}&count=100&format=json`,
            )
            .then((results) => {
              return results;
            })
            .catch((err) => {
              console.error(err);
            })),
        );
      })
      .then((allNews) => {
        allPatchNotes = allNews.map((gameNews) => {
          gameNews.data.appnews.newsitems = gameNews.data.appnews.newsitems.filter(
            (news) => news.tags && news.tags.includes('patchnotes'),
          );
          return gameNews;
        });
        return Promise.all(
          allPatchNotes.map((patchNotes) => Games.findOne({ id: patchNotes.data.appnews.appid })),
        );
      })
      .then((games) => {
        games.forEach((game, i) => {
          if (
            allPatchNotes[i].data.appnews.newsitems.length
            && ((!game.most_recent_update)
            || (game.most_recent_update.title
              !== allPatchNotes[i].data.appnews.newsitems[0].title))
          ) {
            game.most_recent_update = game.most_recent_update ? game.most_recent_update : {};
            game.most_recent_update.title = allPatchNotes[i].data.appnews.newsitems[0].title;
            game.most_recent_update.url = allPatchNotes[i].data.appnews.newsitems[0].url;
            Games.findOneAndUpdate({ id: game.id }, game).catch((err) => console.error('khjbsdcisbvk', err));
            Promise.all(
              users
                .map((user) => {
                  if (user.gameSubscriptions.includes(game.id)) {
                    const text = `**New Update**\n${game.name}\n${game.most_recent_update.title}\n${game.most_recent_update.url}`;
                    return axios.post(
                      `https://api.telegram.org/bot${botToken}/sendMessage`,
                      {
                        chat_id: user.chatId,
                        text,
                      },
                    ).catch((err) => console.error(err));
                  }
                  return null;
                })
                .filter((a) => a !== null),
            );
          }
        });
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  });
});
// setTimeout(fifif, 24 * 60 * 60 * 1000)

// testing
game.get('/subscribe', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId })
    .then((userInfo) => {
      if (userInfo.gameSubscriptions.length === 0) {
        res.status(404).send('error on the server');
      }
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

// subscribing a user to a game by it's id
game.put('/subscribe/:id', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId })
    .then(({ gameSubscriptions }) => {
      gameSubscriptions.push(req.params.id);
      return Users.updateOne({ id: req.cookies.ShowNTellId }, { gameSubscriptions });
    })
    .then(() => res.status(201).send('successfully subscribed!'))
    .catch((err) => {
      console.error('couldn\'t subscribe', err);
      res.sendStatus(404);
    });
});

// unsubscribe a videogame for a user by game id
game.put('/unsubscribe', (req, res) => {
  console.log(req.body);
  const { game, subscriptions, user } = req.body;
  const subscriptionLocation = subscriptions.indexOf(game.toString());
  subscriptions.splice(subscriptionLocation, 1);
  console.log(subscriptions);
  return Users.updateOne({ id: user }, { gameSubscriptions: subscriptions })
    .then(() => {
      console.log('we got to the findOne then catch');
      return Users.findOne({ id: user });
    })
    .then((userObj) => {
      console.log('userObj', userObj);
      res.send(userObj).status(203);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

game.get('/subscribed/:id', (req, res) => {
  Games.findOne({ id: req.params.id })
    .then((game) => {
      res.send(game).status(200);
    })
    .catch();
});
game.post('/reviews', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId })
    .then((data) => {
      const userReviews = data.user_reviews;
      Users.updateOne(
        { id: req.cookies.ShowNTellId },
        {
          $push: { user_reviews: req.body.review },
        },
      ).then((data) => res.status(201).send(JSON.stringify(data)));
    })
    .catch((err) => console.log(err));
});

module.exports = game;
