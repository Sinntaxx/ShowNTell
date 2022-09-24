/* eslint-disable no-console */
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const passport = require('passport');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
require('./db/index');

const movieDbKey = process.env.MOVIE_DATABASE_KEY;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const movieKey = process.env.MOVIE_DATABASE_KEY;
const omdbKey = process.env.OMDB_KEY;
const Notifs = require('twilio')(accountSid, authToken);
const { ExpressPeerServer } = require('peer');
const { game } = require('./Routes/index.js');
const { GoogleStrategy } = require('./oauth/passport');

const { Users, Posts, Shows, Replys, Movies } = require('./db/schema.js');

const app = express();

const peerServer = ExpressPeerServer(app, {
  proxied: true,
  debug: true,
  path: '/ShowNTell',
  ssl: {},
});
app.use(peerServer);

const client = path.resolve(__dirname, '..', 'client', 'dist');

let userInfo = null;

app.use(express.static(client));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(cors());
app.use('/game', game);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    saveUninitialized: false,
    resave: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get(
  '/auth/google',
  passport.authenticate(
    'google',
    { scope: ['https://www.googleapis.com/auth/plus.login'] },
    (req, res) => {},
  ),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/logout' }),
  (req, res) => {
    const newUser = new Users({
      id: Number(req.user.id),
      name: req.user.displayName,
    });
    res.cookie('ShowNTellId', req.user.id);

    Users.findOne({ id: Number(req.user.id) }).then((data) => {
      if (data) {
        res.redirect('/');
        userInfo = data;
      } else {
        newUser.notifs = false;
        newUser.save().then(() => {
          userInfo = newUser;
          res.redirect('/');
        });
      }
    });
  },
);

app.get('/user', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    res.json(userInfo);
  });
});

app.get('/users', (req, res) => {
  Users.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});
app.post('/reviews', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId })
    .then((data) => {
      const userReviews = data.user_reviews;
      console.log(data, 'im here in /reviews..........');
      Users.updateOne(
        { id: req.cookies.ShowNTellId },
        {
          $push: { user_reviews: req.body.review },
        },
      ).then((data) => res.status(201).send(JSON.stringify(data)));
    })
    .catch((err) => console.log(err));
});

app.get('/posts', (req, res) => {
  Posts.find()
    .then((posts) => res.send(posts))
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});

// !! //
// ** //
// ?? //

app.get('/getrectv/:id', (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/tv/${req.params.id}/recommendations?api_key=${movieDbKey}&language=en-US&page=1`,
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => res.send(err));
});

app.get('/getrecmovie/:id', (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${req.params.id}/recommendations?api_key=${movieDbKey}&language=en-US&page=1`,
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => res.send(err));
});

app.get('/gettvdata/:name', (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/search/tv?api_key=${movieDbKey}&query=${req.params.name}`,
    )
    .then((response) => {
      const subName = response.data.results[0].name;
      const subID = response.data.results[0].id;
      const subOverview = response.data.results[0].overview;

      const optionsObject = {
        name: subName,
        id: subID,
        overview: subOverview,
      };
      res.status(200).send(optionsObject);
    })
    .catch((err) => res.send(err));
});

app.get('/getmoviedata/:name', (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/search/movie?api_key=${movieDbKey}&query=${req.params.name}`,
    )
    .then((response) => {
      const subName = response.data.results[0].title;
      const subID = response.data.results[0].id;
      const subOverview = response.data.results[0].overview;

      const optionsObject = {
        name: subName,
        id: subID,
        overview: subOverview,
      };
      res.status(200).send(optionsObject);
    })
    .catch((err) => res.send(err));
});

// ?? //
// ** //
// !! //

app.get('/shows', (req, res) => {
  Shows.find()
    .then((data) => res.status(200).json(data))
    .catch();
});

app.get('/findUser', (req, res) => {
  Users.find()
    .then((data) => res.json(data))
    .catch();
});

app.get('/user/posts/:name', (req, res) => {
  const user = req.params.name;
  Posts.find({ name: user })
    .then((posts) => res.send(posts))
    .catch();
});

app.put('/startMessage/:user/:name', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Users.updateOne(
      { id: userInfo.id },
      {
        messages: [
          ...userInfo.messages,
          { id: req.params.user, name: req.params.name, text: [] },
        ],
      },
    )
      .then((result) => res.json(result))
      .catch();
  });
});

app.put('/sendMessage/:id/:text', (req, res) => {
  const content = userInfo.messages;
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    for (let i = 0; i < content.length; i += 1) {
      if (content[i].id === req.params.id) {
        content[i].text.push({ name: userInfo.name, message: req.params.text });
        break;
      }
    }
    Users.updateOne({ id: userInfo.id }, { messages: content })
      .then(() => Users.findOne({ id: req.params.id }))
      .then((result) => {
        const replace = result.messages || [];
        let test = false;
        for (let i = 0; i < replace.length; i += 1) {
          if (replace[i].id === String(userInfo.id)) {
            replace[i].text.push({
              name: userInfo.name,
              message: req.params.text,
            });
            test = true;
            break;
          }
        }
        if (test) {
          Users.updateOne(
            { id: Number(req.params.id) },
            {
              messages: replace,
              notifs: [...data.notifs, `${userInfo.name} messaged you`],
            },
          ).then((results) => res.json(results));
        } else {
          Users.updateOne(
            { id: Number(req.params.id) },
            {
              messages: [
                ...replace,
                {
                  id: String(userInfo.id),
                  name: userInfo.name,
                  text: [{ name: userInfo.name, message: req.params.text }],
                },
              ],
              notifs: [...data.notifs, `${userInfo.name} messaged you`],
            },
          ).then((allResult) => res.json(allResult));
        }
      });
  });
});

// API call to search endpoint with query parameter, using url.
app.get('/search/:query', (req, res) => {
  const url = `http://api.tvmaze.com/search/shows?q=${req.params.query}`;
  return axios(url)
    .then(({ data }) => data)
    .then((data) => res.status(200).send(data))
    .catch();
});

// warning: arin made this
// search for a list of multiple movies
app.get('/search/movies/:query', (req, res) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&language=en-US&query=${req.params.query}&page=1&include_adult=false`;
  return axios(url)
    .then(({ data }) => data)
    .then((data) => res.status(200).send(data))
    .catch((err) => console.log(err, 'MOVE AUTH ISSUE'));
});
// get info on an individual movie : omdb
app.get('/search/movie/:query', (req, res) => {
  const url = `http://www.omdbapi.com/?apikey=${omdbKey}&t=${req.params.query}`;
  return axios(url)
    .then(({ data }) => data)
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log(err);
    });
});

app.get('/show/:id', (req, res) => {
  Shows.find({ id: req.params.id })
    .then((record) => {
      if (record.length > 0) {
        return record[0];
      }
      return axios(`http://api.tvmaze.com/shows/${req.params.id}`)
        .then(({ data }) => Shows.create({
          id: data.id,
          name: data.name,
          posts: [],
          subscriberCount: 0,
        }))
        .then((result) => result)
        .catch();
    })
    .then((result) => res.status(200).send(result))
    .catch(() => res.status(500).send());
});

// warning:arin made this
app.get('/movie/:id', (req, res) => {
  Movies.find({ id: req.params.id })
    .then((record) => {
      if (record.length > 0) {
        return record[0];
      }
      return axios(
        `https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${movieKey}&language=en-US`,
      )
        .then(({ data }) => Movies.create({
          id: data.id,
          title: data.title,
          posts: [],
          subscriberCount: 0,
        }))
        .then((result) => result)
        .catch();
    })
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(500).send(err));
});

app.put('/subscribe/:id', (req, res) => {
  const { id } = req.params;
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Users.findById(userInfo._id)
      .then((user) => {
        if (!user.subscriptions.includes(id)) {
          userInfo.subscriptions = [...user.subscriptions, id];
          Users.updateOne(
            { _id: user._id },
            { subscriptions: [...user.subscriptions, id] },
          )
            .then(() => {
              Shows.findOne({ id })
                .then((record) => {
                  Shows.updateOne(
                    { id: req.params.id },
                    { subscriberCount: record.subscriberCount + 1 },
                  ).catch();
                })
                .catch();
            })
            .catch();
        }
      })
      .then(() => res.status(200).send())
      .catch(() => res.status(500).send());
  });
});
// make a new movie subscriptions end point here
app.put('/subscribeMovie/:id', (req, res) => {
  const { id } = req.params;
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Users.findById(userInfo._id)
      .then((user) => {
        if (!user.movieSubscriptions.includes(id)) {
          userInfo.movieSubscriptions = [...user.movieSubscriptions, id];
          Users.updateOne(
            { _id: user._id },
            { movieSubscriptions: [...user.movieSubscriptions, id] },
          )
            .then(() => {
              Movies.findOne({ id })
                .then((record) => {
                  Movies.updateOne(
                    { id: req.params.id },
                    { subscriberCount: record.subscriberCount + 1 },
                  ).catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      })
      .then(() => res.status(200).send())
      .catch(() => res.status(500).send());
  });
});

app.put('/unsubscribe', (req, res) => {
  Users.updateOne(
    { id: req.body.userId },
    { $pull: { subscriptions: req.body.showId } },
  )
    .then(() => {
      Users.findOne({ id: req.body.userId }).then((data) => {
        res.send(data);
      });
    })
    .catch((err) => console.log(err));
});

app.put('/unsubscribeMovie', (req, res) => {
  Users.updateOne(
    { id: req.body.userId },
    { $pull: { movieSubscriptions: req.body.movieId } },
  )
    .then(() => {
      Users.findOne({ id: req.body.userId }).then((data) => {
        res.send(data);
      });
    })
    .catch((err) => console.log(err));
});

app.get('/delete', (req, res) => {
  Users.deleteMany()
    .then(() => Posts.deleteMany())
    .then(() => Shows.deleteMany())
    .then(() => Replys.deleteMany())
    .then(() => res.status(200).json('done'))
    .catch();
});

app.get('/logout', (req, res) => {
  userInfo = null;
  res.clearCookie('ShowNTellId');
  res.status(200).json(userInfo);
});

app.post('/upload', async (req, res) => {
  // console.log(req.body, 428);
  try {
    const pic = req.body.img;
    const uploadedRes = await cloudinary.uploader.upload(pic, {
      upload_preset: 'showntell',
    });
    // console.log(uploadedRes, 'hello');

    res.status(201).send(uploadedRes.public_id);
  } catch (error) {
    console.error(error, 438);
  }
});

app.post('/posts', (req, res) => {
  const { title, content, poster, show, name } = req.body;
  const { text, pic } = content;
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    return Posts.create({
      title,
      content: { text, pic },
      user: poster,
      name,
      topic_id: show,
      comments: {},
      createdAt: new Date(),
      liked: false,
      likedCount: 0,
    })
      .then((post) => {
        Users.findById(poster)
          .then((user) => {
            userInfo.posts = [...user.posts, post._id];
            Users.updateOne(
              { _id: poster },
              { posts: [...user.posts, post._id] },
            ).catch();
          })
          .then(() => {
            Shows.findOne({ id: show })
              .then((record) => {
                Shows.updateOne(
                  { id: show },
                  { posts: [...record.posts, post._id] },
                ).catch();
              })
              .catch();
          })
          .catch();
      })
      .then(() => res.status(201).send())
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  });
});

app.get('/post/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => res.status(200).send(post))
    .catch(() => res.status(500).send());
});

app.post('/number', (req, res) => {
  const { number } = req.body;
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    if (!number) {
      Users.updateOne({ id: userInfo.id }, { phone: number }).then((data) => res.json(data));
    } else {
      Users.updateOne(
        { id: userInfo.id },
        {
          phone: number,
          notifs: [`you will now receive notifications @ ${number}   `],
        },
      ).then((data) => res.json(data));
    }
  });
});

app.get('/notifs/:text/:id', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;

    res.json(req.params);
    if (req.params.id === 'null') {
      Notifs.messages
        .create({
          body: req.params.text,
          from: '+12678677568',
          to: userInfo.phone,
        })
        .then((message) => res.json(message.sid))
        .catch();
    } else {
      Users.findOne({ id: req.params.id }).then((data) => {
        Notifs.messages
          .create({
            body: req.params.text,
            from: '+12678677568',
            to: data.phone,
          })
          .then((message) => res.json(message.sid))
          .catch();
      });
    }
  });
});

app.delete('/notifs/:index', (req, res) => {
  const replacementNotif = [];
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    for (let i = 0; i < userInfo.notifs.length; i += 1) {
      if (i !== Number(req.params.index)) {
        replacementNotif.push(userInfo.notifs[i]);
      }
    }
    Users.update({ id: userInfo.id }, { notifs: replacementNotif }).then(
      (data) => res.json(data),
    );
  });
});

app.get('/postShow/:id', (req, res) => {
  Shows.findOne({ id: req.params.id })
    .then((data) => res.json(data))
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});

app.get('/postUser/:id', (req, res) => {
  Users.findOne({ _id: req.params.id }).then((data) => res.json(data));
});

app.get('/liked/:id', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;

    Posts.findOne({ _id: req.params.id }).then((data) => {
      const newLike = [];
      let test = true;
      for (let i = 0; i < data.likes.length; i += 1) {
        if (data.likes[i] === userInfo.id) {
          test = false;
          continue;
        } else {
          newLike.push(data.likes[i]);
        }
      }
      if (test) {
        Posts.updateOne(
          { _id: req.params.id },
          { likes: [...data.likes, userInfo.id] },
        ).then(() => res.json());
      } else {
        Posts.updateOne({ _id: req.params.id }, { likes: newLike }).then(() => res.json());
      }
    });
  });
});

app.get('/replys/:id/:content', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Replys.create({
      user: userInfo._id,
      content: req.params.content,
      comment: [],
      likes: [],
    }).then(({ _id }) => {
      Posts.findOne({ _id: req.params.id }).then((data) => {
        Posts.updateOne(
          { _id: req.params.id },
          { comment: [...data.comment, _id] },
        )
          .then(() => Posts.findOne({ _id: req.params.id }))
          .then((result) => res.json(result));
      });
    });
  });
});

app.get('/feeds/:id', (req, res) => {
  Replys.findOne({ _id: req.params.id }).then((data) => res.json(data));
});

app.get('/findReplays', (req, res) => {
  Replys.find().then((data) => res.json(data));
});

app.post('/replys/:id/:content', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Replys.create({
      user: userInfo._id,
      content: req.params.content,
      comment: [],
      likes: [],
    }).then(({ _id }) => {
      Replys.findOne({ _id: req.params.id }).then((data) => {
        Replys.updateOne(
          { _id: req.params.id },
          { comment: [...data.comment, _id] },
        )
          .then(() => Replys.findOne({ _id: req.params.id }))
          .then((result) => res.json(result));
      });
    });
  });
});

app.get('/likedPost/:id', (req, res) => {
  Users.findOne({ id: req.cookies.ShowNTellId }).then((data) => {
    userInfo = data;
    Replys.findOne({ _id: req.params.id }).then((data) => {
      const newLike = [];
      let test = true;
      for (let i = 0; i < data.likes.length; i += 1) {
        if (data.likes[i] === userInfo.id) {
          test = false;
          continue;
        } else {
          newLike.push(data.likes[i]);
        }
      }
      if (test) {
        Replys.updateOne(
          { _id: req.params.id },
          { likes: [...data.likes, userInfo.id] },
        ).then(() => res.json());
      } else {
        Replys.updateOne({ _id: req.params.id }, { likes: newLike }).then(() => res.json());
      }
    });
  });
});
/**
 * FRIEND LIST FEATURES
 */
app.put('/follow', (req, res) => {
  const { follower, followed } = req.body;
  // find user to be followed
  Users.findOne({ _id: followed })
    .then((data) => {
      // update user that will follow
      Users.updateOne({ _id: follower }, { $push: { following: data } }).then(
        () => {
          Users.findOne({ _id: follower }).then((data) => {
            res.send(data);
          });
        },
      );
    })
    .catch((err) => res.send(err));
});

app.put('/unfollow', (req, res) => {
  const { follower, followed } = req.body;
  Users.updateOne(
    { _id: follower },
    { $pull: { following: { id: followed } } }, // not working with _id for some reason
  ).then(() => {
    Users.findOne({ _id: follower }).then((data) => {
      res.send(data);
    });
  });
});

// test changes in users props
app.get('/users/:id/', (req, res) => {
  console.log('hi');
  Users.findOne({ id: req.params.id })
    .then((data) => {
      console.log('hi');
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

// app.get('/users/posts/', (req, res) => {
//   Users.findOne({ id: req.params.id })
//     .then((data) => res.json(data))
//     .catch((err) => res.send(err));
// });

// Randolph's Tight Back End API Calls

// 1a. TV show cast.
app.get('/cast/:id', (req, res) => {
  axios
    .get(`http://api.tvmaze.com/shows/${req.params.id}/cast`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// 1b. TV show crew.
app.get('/crew/:id', (req, res) => {
  axios
    .get(`http://api.tvmaze.com/shows/${req.params.id}/crew`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// 2. Movie cast and crew.
app.get('/movieData/:id', (req, res) => {
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${req.params.id}/credits?api_key=${movieKey}&language=en-US&page=1`,
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      res.send(err);
    });
});

const options = {
  key: fs.readFileSync('server/config/cert.key'),
  cert: fs.readFileSync('server/config/cert.crt'),
};
https.createServer(options, app).listen(8080, () => {
  console.log('https://localhost:8080');
});
app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('http://localhost:8000');
});
