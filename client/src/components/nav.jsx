import React, { useState } from 'react';
import { FaHome, FaStar, FaPen, FaBell, FaEnvelope, FaSearch, FaDoorOpen, FaNewspaper, FaLinkedin, FaUnity, FaHandshake, FaFingerprint, FaSteamSymbol, FaFantasyFlightGames } from 'react-icons/fa';
import logo from './HomePage/img/logo1.png';
// import Notifications from './HomePage/Notifications.jsx';

const Nav = ({
  user,
  onClick,
  logout,
  search,
  setSearch,
  onSearch,
  onSearchTwo,
}) => (
  <div>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap"
      rel="stylesheet"
    />
    <img
      id="homeButton"
      src={logo}
      alt="logo"
      onClick={() => onClick('homePage')}
      className="views"
      title="home feed"
    />
    <ul className="navbar">
      <li
        onClick={() => onClick('home')}
        id="home-icon"
        className="views"
        title="home feed"
      >
        <FaHome />
        {/* <p id="home-icon-hover">home</p> */}
        {' '}
      </li>
      <li
        onClick={() => onClick('sub')}
        className="views"
        title="subscriptions"
      >
        {' '}
        <FaStar />
      </li>

      <li
        onClick={() => onClick('recommendedBoth')}
        className="views"
        title="recommendedBoth"
      >
        <FaFingerprint />
        {' '}
      </li>

      <li
        onClick={() => onClick('post')}
        className="views"
        title="create a post"
      >
        {' '}
        <FaPen />
        {' '}
      </li>
      <li
        onClick={() => onClick('review')}
        className="views"
        title="create a review"
      >
        {' '}
        <FaNewspaper />
        {' '}
      </li>
      <li
        onClick={() => onClick('notifs')}
        className="views"
        title="general notifications"
      >
        <FaBell />
        {' '}
      </li>
      {!user.notifs ? (
        <li
          onClick={() => onClick('gameNotifs')}
          className="views"
          title="game update notifications"
        >
          <FaBell />
          {' '}
        </li>
      ) : null}
      <li onClick={() => onClick('DMs')} className="views" title="messages">
        <FaEnvelope />
        {' '}
      </li>
      <li onClick={() => onClick('videoGames')} className="views" title="videoGames">
        <FaFantasyFlightGames />
        {' '}
      </li>
      <li
        onClick={() => onClick('recGames')}
        className="Views"
        title="recGames"
      >
        <FaSteamSymbol />
      </li>
      <li onClick={() => onClick('friends')} className="views" title="friends">
        <FaHandshake />
        {' '}
      </li>
      <li onClick={logout} title="log out">
        <FaDoorOpen />
      </li>
      <li>
        {' '}
        <div className="wrap">
          <div className="search">
            <input
              type="text"
              className="search-term"
              placeholder="what are you watching?"
              value={search}
              autoComplete="off"
              // Does work of setting the search state ('').
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch();
                  onSearchTwo();
                }
              }}
            />
            <FaSearch
              type="submit"
              className="srch-button"
              onClick={() => {
                onSearch();
                onSearchTwo();
              }}
            >
              <i className="search-icon" />
            </FaSearch>
          </div>
        </div>
      </li>
    </ul>
  </div>
);

export default Nav;
