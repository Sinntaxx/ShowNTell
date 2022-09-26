const mongoose = require('mongoose');
require('dotenv').config();
const axios = require('axios');

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.hbkp2l0.mongodb.net/ShowNTell?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://NetflixNCoders:@cluster0.otxhu.mongodb.net/ShowNTell?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  // eslint-disable-next-line no-console
  .then(() => {
    axios
      .post('https://3e55-99-121-10-200.ngrok.io/game/updates')
      .then(() => {
        console.log('Notifications Sent');
      })
      .catch((err) => {
        console.error(err);
      });
    setInterval(() => {
      axios
        .post('https://3e55-99-121-10-200.ngrok.io/game/updates')
        .then(() => {
          console.log('Notifications Sent');
        })
        .catch((err) => {
          console.error(err);
        });
    }, 24 * 60 * 60 * 1000);
    console.log('connected to db');
  })
  .catch();
