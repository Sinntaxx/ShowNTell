import React, { useState, useEffect } from 'react';
import './videogame.css';
import axios from 'axios';

const VideoGameEntry = ({ game, user, setUser }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscibeClick = () => {
    console.log('user→', user);
    axios.put(`/game/subscribe/${game.id}`)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setIsSubscribed(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnsubscribeClick = () => {
    axios.put('/game/unsubscribe', {
      game: game.id,
      subscriptions: user.gameSubscriptions,
      user: user.id,
    })
      .then((userObj) => {
        setUser(userObj.data);
        setIsSubscribed(false);
      });
  };

  useEffect(() => {
    const stringGameId = String(game.id);
    console.log('user', user);
    if (user.gameSubscriptions.length && user.gameSubscriptions.includes(stringGameId)) {
      setIsSubscribed(true);
    }
  }, [isSubscribed]);

  const button = isSubscribed ? <button className="unsubscribe-button" onClick={handleUnsubscribeClick}>Unsubscribe</button> : <button className="subscribe-button" onClick={handleSubscibeClick}>Subscribe</button>;
  return (
    <div className="game-card">
      <div className="game-container">
        <h3 className="game-title"><b>{game.name}</b></h3>

        <p className="text">{game.short_desc}</p>
        <img className="video-game-image" src={game.header_image} alt="cover-art" />
        <p className="text">{game.price_overview}</p>
        {button}
      </div>
    </div>
  );
};

export default VideoGameEntry;

//  useEffect(() => {
//    const stringGameId = String(game.id);
//    if (user.gameSubscriptions.length) {
//      user.gameSubscriptions.forEach((id) => {
//        if (id === stringGameId) {
//          console.log('id\'s have matched', stringGameId, id);
//          setIsSubscribed(true);
//        } else {
//          console.log('id didn\'t match smh', stringGameId, id);
//          setIsSubscribed(false);
//        }
//      });
//    }
//  }, [isSubscribed]);
