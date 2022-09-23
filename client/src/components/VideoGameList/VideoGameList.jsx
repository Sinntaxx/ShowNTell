import React, { useState, useEffect } from 'react';
import VideoGameEntry from './VideoGameEntry.jsx';
import './videogame.css';

const VideoGameList = () => {
  const dummyData = ['Elden Ring', 'Dark Souls 2', 'Goat Simulator'];
  const [videoGamesFromSteam, setVideoGamesFromSteam] = useState([]);
  // const [data, setData] = useState([]);
  // const [isThere, setIsThere] = useState(false);

  // useEffect(() => {
  //   setData(dummyData);
  //   setIsThere(true);
  // }, [data]);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap" rel="stylesheet" />
      <div>
        <form>
          <label htmlFor="game-name" className="video-game-search-label"><input type="text" id="game-name" game="game-name" /></label>

        </form>
        <button className="video-game-submit-button">submit</button>
      </div>
      <div>
        { dummyData.map((ele) => <VideoGameEntry ele={ele} />) }
      </div>

    </>
  );
};

export default VideoGameList;
