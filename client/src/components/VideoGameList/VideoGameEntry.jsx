import React from 'react';

const VideoGameEntry = ({ dummyData }) => {
  return (
    <div>
      This is a video game lol:
      <h2>
        { dummyData.ele }
        {' '}
      </h2>

    </div>
  );
};

export default VideoGameEntry;
