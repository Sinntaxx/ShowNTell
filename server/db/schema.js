const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: Number,
  name: String,
  posts: Array,
  messages: Array,
  phone: String,
  notifs: Array,
  follows: Array,
  subscriptions: Array,
  movieSubscriptions: Array,
  following: Array,
  followers: Array,
  chatId: Number,
  achievements: Array,
});

const Users = mongoose.model('Users', userSchema);

const showSchema = mongoose.Schema({
  name: String,
  id: Number,
  posts: Array,
  subscriberCount: Number,
});

const Shows = mongoose.model('Shows', showSchema);

const showMovie = mongoose.Schema({
  title: String,
  id: Number,
  posts: Array,
  subscriberCount: Number,
});

const Movies = mongoose.model('Movies', showMovie);

const postSchema = mongoose.Schema({
  user: String,
  show: String,
  title: String,
  content: {
    text: String,
    pic: String,
  },
  comment: Array,
  createdAt: Date,
  likes: Array,
});

const Posts = mongoose.model('Posts', postSchema);

const replySchema = mongoose.Schema({
  user: String,
  content: String,
  comment: Array,
  createdAt: Date,
  likes: Array,
});

const Replys = mongoose.model('Replys', replySchema);

const gameSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  description: String,
  short_desc: String,
  about: String,
  header_image: String,
  requirements: Object,
  developers: [String],
  price: Object,
  package: Object,
  platforms: Object,
  categories: Array,
  genres: Array,
  screenshots: Array,
  movies: Array,
  achievements: Object,
  release_date: Object,
  user_reviews: Array,
  most_recent_update: String,
});

const Games = mongoose.model('Game', gameSchema);

const notificationSchema = mongoose.Schema({
  gameId: Number,
  userId: Number,
});

const Notifications = mongoose.model('Notification', notificationSchema);
// ?? //
// ** //
// !! //
// !! //
// ** //
// ?? //

// const recommendedTVSchema = mongoose.Schema({
//   user: String,
//   subscriptions: Array,
//   movieSubscriptions: Array,
//   shows: Array,
//   content: Array,
// });

// const RecommendedTV = mongoose.model('RecommendedTV', recommendedTVSchema);

// ?? //
// ** //
// !! //
// !! //
// ** //
// ?? //

module.exports = {
  Users,
  Shows,
  Posts,
  Replys,
  Movies,
  Games,
  Notifications,
};
