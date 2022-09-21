import React from 'react';
import VideoGameEntry from './VideoGameEntry.jsx';

const VideoGameList = () => {
  const dummyData = ['Elden Ring', 'Dark Souls 2', 'Goat Simulator'];
  return (
    <div>
      {dummyData.map((ele) => {
        return <VideoGameEntry dummmyData={ele} />;
      })}
    </div>
  );
};

export default VideoGameList;
