import React, { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const AchievementEntry = ({ achievement, gameId, setPlayers, setUpdateCount, updateCount, player1 }) => {
  const [gotAchievement, setGotAchievement] = useState(false);

  const achievementGet = () => {
    const found = player1.achievements.find((ach) => {
      if (ach.gameId === gameId && ach.achievement === achievement.name) {
        return ach;
      }

      return undefined;
    });
    if (found) {
      window.alert('you already have this achievement');
    }
    axios.put('/game/getAchievement', {
      achievement,
      id: player1.id,
      gameId,
    })
      .then(({ data }) => {
        console.log('got the achievement', data);
        return axios.get('/game/playerData');
      })
      .catch((err) => {
        console.error('error on getting achievement\n', err);
      })
      .then(({ data }) => {
        console.log('\n\n\n\nupdate player data', data);
        setPlayers(data);
        setUpdateCount(updateCount + 1);
      })
      .catch((err) => {
        console.log('error getting playerData', err);
      });
  };

  // update players current achievements

  return (
    <ListItem
      alignItems="center"
      key={`${achievement.name}${achievement.desc}`}
    >
      <ListItemIcon sx={{ width: '64px', height: '64px', pr: '10px' }}>
        <img alt="" src={achievement.imgUnlocked} />
      </ListItemIcon>
      <ListItemText
        primary={achievement.name}
        secondary={achievement.desc}
        sx={{
          color: '#909497',
        }}
        secondaryTypographyProps={{
          color: '#909497',
        }}
      />
      <ListItemButton onClick={achievementGet} sx={{ justifyContent: 'right' }}>
        <Button component="h4" variant="text" sx={{ color: '#909497' }}>+</Button>
      </ListItemButton>
    </ListItem>
  );
};

export default AchievementEntry;
