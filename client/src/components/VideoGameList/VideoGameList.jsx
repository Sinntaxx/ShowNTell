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
    console.log('we\'re in the handlesubmissionclick');
    axios.get(`/game/byname/${enteredVideoGame}`)
      .then(({ data }) => {
        console.log('data from db', data);
        setVideoGamesFromDB(data);
        setVideoGameIsThere(true);
      })
      .catch((err) => {
        console.error('inside axios catch', err);
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

        <label htmlFor="game-name" className="video-game-search-label">
          Search for a videogame!
          <input
            type="text"
            id="game-name"
            game="game-name"
            onKeyPress={(e) => (e.key === 'Enter' ? handleSubmissionClick() : null)}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </label>

        <button className="video-game-submit-button" onClick={handleSubmissionClick}>submit</button>
      </div>
      <div>
        { isVideoGameThere ? videoGamesFromDB.map((game, i) => <VideoGameEntry key={`${game}: ${i}`} game={game} user={user} setUser={setUser} enteredVideoGame={enteredVideoGame} />) : <h3 className="text">Games will populate here →</h3>}
      </div>
    </>
  );
};

export default VideoGameList;
