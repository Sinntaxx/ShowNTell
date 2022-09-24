import React from 'react';
import { Stack, LinearProgress } from '@mui/material';

function Loading() {
  return (
    <div>
      <Stack sx={{ width: '66%', color: 'grey.500', m: 'auto' }} spacing={2}>
        <LinearProgress color="inherit" />
      </Stack>
    </div>
  );
}

export default Loading;
