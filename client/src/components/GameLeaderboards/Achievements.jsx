import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
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
      scrollbarColor
      style={{ borderRadius: '10px' }}
      sx={{
        maxHeight: 360,
        overflow: 'scroll',
        scrollbarColor: 'green',
        bgcolor: '#212121',
        borderRadius: '10px',
      }}
      subheader={(
        <ListSubheader
          style={{ justifyContent: 'center' }}
          sx={{
            color: '#909497',
            bgcolor: '#212121',
            justifyItems: 'center',
          }}
        >
          Achievements
        </ListSubheader>
      )}
    >
      {currGame.achievements.map((achiev) => <AchievementEntry achievement={achiev} user={user} gameId={currGame.id} />)}

    </List>
  );
};

export default Achievements;

// for later if I get the chance
// renderOption={(props, option) => (
//   <Box component="li" >
//     {option}
//   </Box>
// )}
