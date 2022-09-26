import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const AchievementEntry = ({ achievement }) => {
  return (
    <ListItem alignItems="center">
      <ListItemIcon>
        <img alt="" src={achievement.imgUnlocked} />
      </ListItemIcon>
      <ListItemText
        primary={achievement.name}
        secondary={achievement.desc}
        sx={{
          color: '#5c637b',
        }}
        secondaryTypographyProps={{
          color: '#5c637b',
        }}
      />
    </ListItem>
  );
};

export default AchievementEntry;
