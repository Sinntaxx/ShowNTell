import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import axios from 'axios';

import AchievementEntry from './AchievementEntry.jsx';

const Achievements = ({ user, gameList, currGame }) => {
  // select game to display achievements for
  const [game, setGame] = useState({});

  // testing currGame
  useEffect(() => {
    console.log('currGame', currGame);
  }, []);
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        maxHeight: 360,
        overflow: 'scroll',
        scrollbarColor: '#5c637b',
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
      {currGame.achievements.map((achiev) => <AchievementEntry achievement={achiev} />)}

    </List>
  );
};

export default Achievements;
