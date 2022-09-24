import React from 'react';
import Achievements from './Achievements.jsx';

const Leaderboards = ({ user }) => {
  return (
    <div>
      <Achievements user={user} />
    </div>
  );
};

export default Leaderboards;
