import React, { useState } from 'react';
import FeedItem from './feedItem.jsx';
import './homefeed.css';
import Review from '../Review/Review.jsx';

const HomeFeed = ({ posts, handleUserClick, user, setPosts, setUser }) => (
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

export default HomeFeed;
