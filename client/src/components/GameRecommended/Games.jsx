import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './games.css';
import Loading from './Loading.jsx';

const Games = ({ recGames }) => {
  return (
    <div className="container">
      <h1 className="text">Recommended Games!</h1>
      {
        recGames.length
          ? recGames.map((game) => {
            return (
              <div className="card">
                <div className="container">
                  <img src={game.header_image} alt="" />
                  <h4 className="text"><b>{game.name}</b></h4>
                  <h5 className="text">
                    <b>
                      {
                      game.price_overview ? Number(game.price_overview.final) / 100
                        : (game.package_groups[0] ? game.package_groups[0].subs[0].option_text : 'Price unavailable')
                  }
                    </b>
                  </h5>
                  <h5 className="text">
                    <b>{game.short_description}</b>
                  </h5>
                </div>
              </div>
            );
          })
          : <Loading />
      }
    </div>
  );
};

export default Games;
