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
        maxWidth: 360,
        maxHeight: 360,
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

      <ListItem alignItems="center">
        <ListItemIcon>
          <img alt="" src={achiev.imgLocked} />
        </ListItemIcon>
        <ListItemText
          primary={achiev.name}
          secondary={achiev.desc}
          sx={{
            color: '#5c637b',
          }}
          secondaryTypographyProps={{
            color: '#5c637b',
          }}
        />
      </ListItem>
    </List>
  );
};

export default Achievements;
