import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const AchievementEntry = ({ achievement, user, gameId }) => {
  const achievementGet = () => {
    axios.put('/game/getAchievement', {
      achievement,
      id: user.id,
      gameId,
    })
      .then((data) => {
        console.log('', data);
      })
      .catch((err) => {
      // console.error('error on \n', err);
      });
  };

  // update players current achievements
  // useEffect(() => {

  // })
  return (
    <ListItem
      alignItems="center"
      key={`${achievement.name}${achievement.desc}`}
    >
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
      <ListItemButton onClick={achievementGet}>
        <Button variant="text">{ FaCheckCircle }</Button>
      </ListItemButton>
    </ListItem>
  );
};

export default AchievementEntry;
