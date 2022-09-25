import React, { useState, useEffect } from 'react';
import axios from 'axios';
// child components
import Achievements from './Achievements.jsx';
import GameSelect from './GameSelect.jsx';
import LeaderboardTable from './LeaderboardTable.jsx';

const Leaderboards = ({ user }) => {
  // players subscribed games
  const [gameList, setGameList] = useState([]);
  const [selectInput, setSelectInput] = useState('');
  // get all players gameSubscriptions on render
  const [currGame, setCurrGame] = useState({});
  // player info for leaderboards
  const [players, setPlayers] = useState([]);

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
        // console.log('incase of error check gameSubs', gameSubs);
        setGameList(gameSubs);
      }))
      .catch((err) => {
        console.error('error on batch request\n', err);
      });
  }, []);

  // make sure passGame is returning the right value
  useEffect(() => {
    axios.get('game/playerData')
      .then(({ data }) => {
        console.log('list of users, gameSubs, name, and achievements', data);
        setPlayers(data);
      })
      .catch((err) => {
        console.error('error on getting player data from db\n', err);
      });
  }, []);

  return (
    <div>
      {gameList.length ? (
        <GameSelect
          gameList={gameList}
          selectInput={selectInput}
          setSelectInput={setSelectInput}
          setCurrGame={setCurrGame}
        />
      )
        : null}
      {selectInput.length ? (
        <Achievements
          user={user}
          gameList={gameList}
          currGame={currGame}
          selectInput={selectInput}
        />
      )
        : null}
      { players.length ? <LeaderboardTable players={players} currGame={currGame} /> : null }
    </div>
  );
};

export default Leaderboards;
