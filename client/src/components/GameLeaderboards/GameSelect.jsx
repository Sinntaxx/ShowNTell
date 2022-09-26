import React, { useState, useEffect } from 'react';

// material ui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Achievements from './Achievements.jsx';

const GameSelect = ({ gameList, selectInput, setSelectInput, setCurrGame }) => {
  // list of gameSubs names
  const [gameNames, setGameNames] = useState(() => (gameList.map((game) => (game.name))));
  // handleInputChange variable

  const handleSelectChange = (e, val) => {
    for (let i = 0; i < gameList.length; i++) {
      if (gameList[i].name === val) {
        setCurrGame(gameList[i]);
        break;
      }
    }
    setSelectInput(val);
  };

  // testing gameList
  useEffect(() => {
    console.log('selected game', selectInput);
  }, [selectInput]);
  return (
    <Autocomplete
      id="game-select"
      options={gameNames}
      autoHighlight
      autoSelect
      clearOnEscape
      style={{ borderRadius: '5px' }}
      sx={{ bgcolor: '#212121', color: '#909497' }}
      onInputChange={(e, val) => { handleSelectChange(e, val); }}
      getOptionLabel={(name) => (name)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Pick your poison"
          InputLabelProps={{ style: { color: '#909497' } }}
          autoComplete="game"
          bgcolor="white"
          sx={{ input: { color: '#909497' }, bgcolor: '#212121', borderRadius: '10px' }}
        />
      )}
    />
  );
};
export default GameSelect;
