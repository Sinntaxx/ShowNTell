/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import axios from 'axios';
import HomePage from './HomePage/HomePage.jsx';
import Nav from './nav.jsx';
import HomeFeed from './HomeFeed/homeFeed.jsx';

import RecommendedBoth from './Subscriptions/RecommendedBoth.jsx';

import Sub from './Subscriptions/sub.jsx';
import Post from './CreatePost/post.jsx';
import DMs from './DMs/dms.jsx';
import Notifs from './Notifications/notifs.jsx';
import SearchFeed from './SearchBar/searchFeed.jsx';
import ShowFeed from './Subscriptions/showFeed.jsx';
import MovieFeed from './Subscriptions/MovieFeed.jsx';
import FriendList from './FriendList/friendList.jsx';
import VideoGameList from './VideoGameList/VideoGameList.jsx';
import Games from './GameRecommended/Games.jsx';
import Leaderboards from './GameLeaderboards/Leaderboards.jsx';
import Review from './Review/Review.jsx';

const App = () => {
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [view, setView] = useState('homePage');
  const [movieId, setMovieId] = useState('');
  const [showId, setShowId] = useState('');
  const [search, setSearch] = useState('');
  const [searchedShows, setSearchedShows] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [userClicked, setUsersClicked] = useState(false);
  const [test, setTest] = useState(false);
  const [users, setUsers] = useState([]);
  const [recommendedGames, setRecGames] = useState([]);

  const changeView = (newView) => {
    setView(newView);
  };

  const getUser = () => {
    if (!user) {
      axios
        .get('/user')
        .then(({ data }) => {
          setUser(data);
        })
        .then(() => {})
        .then(() => setTest(true))
        .catch();
    } else if (test) {
      changeView('home');
      setTest(false);
    }
  };

  const getPosts = () => {
    if (!posts && user) {
      // if (!userClicked) {
      //   executed = !executed;
      axios
        .get('/posts')
        .then(({ data }) => {
          setPosts(data);
        })
        .catch();
    }
    // }
  };

  const getUsers = () => {
    const buildFollowers = [];
    if (!users.length) {
      axios
        .get('/users')
        .then((result) => {
          const people = result.data;
          people.forEach((person) => {
            if (person.following) {
              person.following.forEach((follow) => {
                if (follow._id === user._id) {
                  buildFollowers.push(person);
                }
              });
            }
          });
          buildFollowers.length !== users.length ? setUsers(buildFollowers) : null;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const logout = () => {
    axios.get('/logout').then(() => {
      setView('homePage');
      setUser(null);
      setPosts(null);
    });
  };

  const createPost = (post) => {
    console.log(post);
    if (post.type === 'game') {
      axios
        .post('/posts', post)
        .then(() => setView('home'))
        .then(() => axios.get('/user').then(({ data }) => setUser(data)))
        .then(() => axios.get('/posts').then(({ data }) => setPosts(data)))
        .catch();
    } else {
      axios
        .post('/posts', post)
        .then(() => setView('home'))
        .then(() => axios.get('/user').then(({ data }) => setUser(data)))
        .then(() => axios.get('/posts').then(({ data }) => setPosts(data)))
        .catch();
    }
  };

  const searchShows = () => {
    // Telling the server to run this API call with the /search/value passed in.
    axios
      .get(`/search/${search}`)
      .then(({ data }) => {
        setView('Shows');
        setSearch('');
        // Sets searchedShows to [] of being mapped over in searchFeed.
        setSearchedShows(data);
      })
      .catch();
  };
  const searchMovies = () => {
    axios
      .get(`/search/movies/${search}`)
      .then(({ data }) => {
        setView('Movies');
        setSearch('');
        setSearchedMovies(data.results);
      })
      .catch((err) => {
        console.log(err);
      });
    if (search === 'Space Jam' || search === 'come on and JAM!') {
      console.log('heyya from redirect');
      window.location.assign('https://www.spacejam.com/1996/');
    }
  };

  // const searchVideoGames = () => {
  //   setView('videoGames');
  // }

  const handleUserClick = (e) => {
    setUsersClicked(!userClicked);
    const usersName = e.target.innerHTML;
    axios.get(`/user/posts/${usersName}`).then(({ data }) => {
      // console.log('TESTING', data);
      setPosts(data);
    });
  };

  const handleShowFeed = () => {
    setUsersClicked(!userClicked);
    getPosts();
  };

  const addShow = (show) => {
    axios
      .get(`/show/${show.id}`)
      .then(({ data }) => {
        setView('showFeed');
        setShowId(data.id);
      })
      .catch();
  };
  const addMovie = (movie) => {
    axios
      .get(`/movie/${movie.id}`)
      .then(({ data }) => {
        setView('movieFeed');
        setMovieId(data.id);
      })
      .catch();
  };

  const subscribe = (showId) => {
    axios
      .put(`/subscribe/${showId}`)
      .then(() => axios.get('/user').then(({ data }) => setUser(data)))
      .catch();
  };
  const subscribeMovie = (movieId) => {
    // make a new endpoint in index.js for subscriptions, line 287
    axios
      .put(`/subscribeMovie/${movieId}`)
      .then(() => axios.get('/user').then(({ data }) => setUser(data)))
      .catch();
  };

  const searchViewSwitcher = () => {
    if (view === 'Shows') {
      changeView('Movies');
    } else if (view === 'Movies') {
      changeView('Shows');
    }
  };

  const viewSwitcher = (inputView) => {
    setView(inputView);
  };
  // call to back end to delete show from database
  const deleteShow = (show) => {
    axios
      .put('/unsubscribe', { userId: user.id, showId: `${show}` })
      .then((data) => {
        console.log(data.data);
        setUser(data.data);
      })
      .catch((err) => console.log(err));
  };
  // call to back end to delete movie from database
  const deleteMovie = (movie) => {
    axios
      .put('/unsubscribeMovie', { userId: user.id, movieId: `${movie}` })
      .then((data) => {
        console.log(data.data);
        setUser(data.data);
      })
      .catch((err) => console.log(err));
  };

  // COME BACK FOR THIS
  const getGames = (genre) => {
    const data = JSON.stringify({
      genre,
    });

    const config = {
      method: 'post',
      url: '/game/genre',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    axios(config)
      .then((response) => {
        setRecGames(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getView = () => {
    if (view === 'homePage') {
      return <HomePage />;
    }
    if (view === 'review') {
      return <Review user={user} createPost={createPost} />;
    }
    if (view === 'sub') {
      return (
        <Sub
          user={user}
          setView={setView}
          deleteMovie={deleteMovie}
          deleteShow={deleteShow}
        />
      );
    }
    if (view === 'recommendedBoth') {
      return <RecommendedBoth user={user} />;
    }
    if (view === 'post') {
      return <Post user={user} createPost={createPost} />;
    }
    if (view === 'home') {
      return <HomeFeed handleUserClick={handleUserClick} user={user} setUser={setUser} posts={posts} setPosts={setPosts} getGames={getGames} />;
    }
    if (view === 'DMs') {
      return <DMs user={user} setUser={setUser} />;
    }
    if (view === 'gameNotifs') {
      return (
        <meta
          httpEquiv="Refresh"
          content={`0; url='https://telegram.me/GameAndWatchBot?start=${user.id}'`}
        />
      );
    }
    if (view === 'notifs') {
      return <Notifs user={user} setUser={setUser} />;
    }
    if (view === 'search' || view === 'Shows' || view === 'Movies') {
      return (
        <SearchFeed
          shows={searchedShows}
          movies={searchedMovies}
          addShow={addShow}
          addMovie={addMovie}
          view={view}
          searchViewSwitcher={searchViewSwitcher}
          // onClick={() => {
          //   addShow();
          //   addMovie();
          // }}
        />
      );
    }
    // To Do: Add Following View
    if (view === 'friends') {
      return <FriendList user={user} users={users} setUser={setUser} />;
    }
    if (view === 'showFeed') {
      return (
        <ShowFeed
          showId={showId}
          subscribe={subscribe}
          viewSwitcher={viewSwitcher}
        />
      );
    }
    if (view === 'movieFeed') {
      return (
        <MovieFeed
          movieId={movieId}
          subscribe={subscribeMovie}
          viewSwitcher={viewSwitcher}
        />
      );
    }
    if (view === 'videoGames') {
      return <VideoGameList viewSwitcher={viewSwitcher} user={user} setUser={setUser} />;
    }
    // Should show the games view
    if (view === 'recGames') {
      return <Games recGames={recommendedGames} />;
    }
    if (view === 'leaderboards') {
      return <Leaderboards user={user} />;
    }
  };

  return (
    <div>
      {user ? (
        <Nav
          user={user}
          search={search}
          onClick={changeView}
          logout={logout}
          setSearch={setSearch}
          onSearch={searchShows}
          onSearchTwo={searchMovies}
          view={view}
        />
      ) : (
        <a
          className="login-button"
          href="/auth/google"
          // onClick={() => axios.get('/auth/google').then(({ data }) => console.log(data))}
        >
          LOGIN WITH GOOGLE
        </a>
      )}
      {getUser()}
      {getPosts()}
      {getUsers()}
      {userClicked ? (
        <button onClick={handleShowFeed}>Show Home Feed</button>
      ) : null}
      {getView()}
    </div>
  );
};

export default App;
