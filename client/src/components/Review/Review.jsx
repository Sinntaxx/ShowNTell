import React, { useState } from 'react';
import axios from 'axios';

const Review = () => {
  const onClick = () => {
    const data = JSON.stringify({
      review: 'review',
    });

    const config = {
      method: 'post',
      url: 'http://localhost:8080/reviews',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <div onClick={onClick}>hello world</div>;
};
export default Review;
