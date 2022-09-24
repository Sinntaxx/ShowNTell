import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import axios from 'axios';

import AchievementEntry from './AchievementEntry.jsx';

const Achievements = ({ user }) => {
  // select game to display achievements for
  const [game, setGame] = useState({});
  const [gameList, setGameList] = useState([]);

  // get users game subscriptions
  useEffect(() => {
    axios.get(`/game/subscriptions/${user.id}`)
      .then(({ data }) => {
        console.log('users gameSubs from db', data);
        const endPoints = data.map((id) => {
          return `/game/byId/${id}`;
        });
        // console.log('endpoints to get each game\n', endPoints);
        return axios.all(endPoints.map((endPoint) => axios.get(endPoint)));
      })
      .catch((err) => {
        console.error('error on retrieving gameSubs in client axios\n', err);
      })
      .then(axios.spread((...res) => {
        console.log('a single response from axios.all\n', res[2].data);
      }))
      .catch((err) => {
        console.error('error on batch request\n', err);
      });
  }, []);

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        maxHeight: 360,
        overflow: 'auto',
        bgcolor: '#212121',
      }}
      subheader={(
        <ListSubheader sx={{
          color: '#5c637b',
          bgcolor: '#212121',
        }}
        >
          Achievements
        </ListSubheader>
      )}
    >
      <AchievementEntry achievement={{
        name: 'Godfrey, First Elden Lord',
        desc: 'Defeated Godfrey, First Elden Lord',
        imgLocked: 'https://www.achievementstats.com/images/icons/locked/3740810.jpg',
        imgUnlocked: 'https://www.achievementstats.com/images/icons/unlocked/3740810.jpg',
      }}
      />
    </List>
  );
};

export default Achievements;
