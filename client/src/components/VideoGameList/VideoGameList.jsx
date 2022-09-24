import React, { useState } from 'react';
import axios from 'axios';
import VideoGameEntry from './VideoGameEntry.jsx';
import './videogame.css';

const VideoGameList = ({ user }) => {
  const dummyData = ['Elden Ring', 'Dark Souls 2', 'Goat Simulator'];
  const [videoGamesFromDB, setVideoGamesFromDB] = useState([]);
  const [isVideoGameThere, setVideoGameIsThere] = useState(false);
  const [enteredVideoGame, setEnteredVideoGame] = useState('');

  const handleSubmissionClick = () => {
    // console.log('value→', document.getElementById('game-name').value);
    // console.log(e.target.value);
    // setEnteredVideoGame(document.getElementById('game-name').value);
    // setEnteredVideoGame(e.target.value);
    // console.log(enteredVideoGame);
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

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap" rel="stylesheet" />
      <div>
        <form>
          <label htmlFor="game-name" className="video-game-search-label">
            <input type="text" id="game-name" game="game-name" onChange={(e) => { setEnteredVideoGame(e.target.value); }} />
          </label>
        </form>
        <button className="video-game-submit-button" onClick={handleSubmissionClick}>submit</button>
      </div>
      <div>
        { videoGamesFromDB.length ? videoGamesFromDB.map((game) => <VideoGameEntry game={game} user={user} />) : 'Games will populate here'}
      </div>
    </>
  );
};

export default VideoGameList;
