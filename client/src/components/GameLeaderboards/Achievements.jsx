import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import axios from 'axios';

import AchievementEntry from './AchievementEntry.jsx';

const Achievements = ({ currGame, setPlayers, setUpdateCount, updateCount, player1 }) => {
  // testing currGame
  useEffect(() => {
  }, [updateCount, currGame]);
  return (
    <List
      scrollbarColor
      style={{ borderRadius: '10px' }}
      sx={{
        maxHeight: 360,
        overflow: 'scroll',
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
      {currGame.achievements.map((achiev) => (
        <AchievementEntry
          achievement={achiev}
          gameId={currGame.id}
          setPlayers={setPlayers}
          updateCount={updateCount}
          setUpdateCount={setUpdateCount}
          player1={player1}
        />
      ))}

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
