import React, { useState } from 'react';
import axios from 'axios';
import VideoGameEntry from './VideoGameEntry.jsx';
import './videogame.css';

const VideoGameList = ({ user, setUser }) => {
  // const dummyData = ['Elden Ring', 'Dark Souls 2', 'Goat Simulator'];
  const [videoGamesFromDB, setVideoGamesFromDB] = useState([]);
  const [isVideoGameThere, setVideoGameIsThere] = useState(false);
  const [enteredVideoGame, setEnteredVideoGame] = useState('');

  const handleSubmissionClick = () => {
    axios.get(`/game/byname/${enteredVideoGame}`)
      .then(({ data }) => {
        console.log('data from db', data);
        setVideoGamesFromDB(data);
        setVideoGameIsThere(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleInputChange = (e) => {
    const enteredGame = e.target.value;
    setEnteredVideoGame(enteredGame);
  };
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap" rel="stylesheet" />
      <div>
        <form>
          <label htmlFor="game-name" className="video-game-search-label">
            Search for a videogame!
            <input
              type="text"
              id="game-name"
              game="game-name"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmissionClick}
              onChange={handleInputChange}
              autoComplete="off"
            />
          </label>
        </form>
        <button className="video-game-submit-button" onClick={handleSubmissionClick}>submit</button>
      </div>
      <div>
        { isVideoGameThere ? videoGamesFromDB.map((game, i) => <VideoGameEntry key={`${game}: ${i}`} game={game} user={user} setUser={setUser} />) : <h3 className="text">Games will populate here →</h3>}
      </div>
    </>
  );
};

export default VideoGameList;
