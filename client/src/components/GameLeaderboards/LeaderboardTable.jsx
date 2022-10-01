import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const LeaderboardTable = ({ currGame, players }) => {
  return (
    <TableContainer dense>
      <Table sx={{ maxWidth: 650, bgcolor: '#1d3b61', borderRadius: '10px' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'whitesmoke' }}>Players</TableCell>
            <TableCell sx={{ color: 'whitesmoke' }} align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ color: '#140e3e' }}>
          {players.map((player) => (
            <TableRow
              key={player.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'whitesmoke' }}
            >
              <TableCell component="th" scope="row" sx={{ color: 'whitesmoke' }}>
                {player.name}
              </TableCell>
              <TableCell align="right" sx={{ color: 'whitesmoke' }}>{player.achievements.length * 10}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;
