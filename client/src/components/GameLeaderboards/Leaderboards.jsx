import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Achievements from './Achievements.jsx';

const Leaderboards = ({ user }) => {
  // players subscribed games
  const [gameList, setGameList] = useState([]);

  // get all players gameSubscriptions on render
  useEffect(() => {
    axios.get(`/game/subscriptions/${user.id}`)
      .then(({ data }) => {
        console.log('users gameSubs from db', data);
        const endPoints = data.map((id) => {
          return `/game/byId/${id}`;
        });
        // console.log('endpoints to get each game\n', endPoints);
        return Promise.resolve(Promise.all((endPoints.map((endPoint) => axios.get(endPoint)))));
      })
      .catch((err) => {
        console.error('error on retrieving gameSubs in client axios\n', err);
      })
      .then(axios.spread((...response) => {
        const gameSubs = response.map(({ data }) => (data));
        // console.log('a single response from axios.all\n', res[2].data);
        console.log('here is the formatted list', gameSubs);
        setGameList(gameSubs[0].achievements);
      }))
      .catch((err) => {
        console.error('error on batch request\n', err);
      });
  }, []);

  return (
    <div>
      {gameList.length ? <Achievements user={user} temp={gameList} /> : null}
    </div>
  );
};

export default Leaderboards;
