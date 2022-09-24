import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';

const achiev = {
  name: 'Welcome home...',
  desc: 'Reach the Estate',
  imgLocked: 'https://www.achievementstats.com/images/icons/locked/152696.jpg',
  imgUnlocked: 'https://www.achievementstats.com/images/icons/unlocked/152696.jpg',
};

const Achievements = () => {
  return (
    <List
      sx={{
        width: '100%',
        dense: true,
        maxWidth: 360,
        maxHeight: 360,
        bgcolor: 'background.paper',
      }}
    >
      <ListSubheader bgcolor="inherit">Achievements</ListSubheader>
      <ListItem alignItems="center">
        <ListItemIcon>
          <img alt="" src={achiev.imgLocked} />
        </ListItemIcon>
        <ListItemText
          primary={achiev.name}
          secondary={achiev.desc}
        />
      </ListItem>
    </List>
  );
};

export default Achievements;
