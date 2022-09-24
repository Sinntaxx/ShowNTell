import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';

import AchievementEntry from './AchievementEntry.jsx';

const Achievements = () => {
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
