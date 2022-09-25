import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedItem from './feedItem.jsx';
import './homefeed.css';
import Review from '../Review/Review.jsx';

const HomeFeed = ({ posts, handleUserClick, user, setPosts, setUser, getGames }) => {
  useEffect(() => {
    // HIGHLY LIKELY TO BE REMOVED
    /// ////////////////////////////
    const config = {
      method: 'get',
      url: 'http://localhost:8000/game/subscribe',
    };
    axios(config)
      .then((response) => {
        getGames(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    /// ///////////////////////
  }, []);
  return (
    <div>
      <div className="home-title"> Home feed</div>
      <div className="home-feed-container">
        {posts
          ? posts.map((post, i) => (
            <FeedItem
              handleUserClick={handleUserClick}
              post={post}
              setPosts={setPosts}
              key={post + i}
              user={user}
              setUser={setUser}
            />
          ))
          : null}
      </div>
    </div>
  );
};

export default HomeFeed;
