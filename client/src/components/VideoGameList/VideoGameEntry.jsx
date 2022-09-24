import React, { useState } from 'react';
import './videogame.css';
import axios from 'axios';
// const [ subscribed, setSubscribed ] = useState([]);

const VideoGameEntry = ({ game, user }) => {
  const handleSubscibeClick = () => {
    console.log('user→', user);
    axios.put(`/game/subscribe/${game[0].id}`)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card">
      <div className="container">
        <h4 className="text"><b>{game[0].name}</b></h4>
        <button className="subscribe-button" onClick={handleSubscibeClick}>Subscibe</button>
      </div>
    </div>

  );
};

export default VideoGameEntry;
