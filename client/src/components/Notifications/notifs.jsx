import React, { useState } from 'react';
import axios from 'axios';
import './notifs.css';
import { FaTrashAlt } from 'react-icons/fa';
import pic from './notifpic.png';

const Notifs = ({ user, setUser }) => {
  const [number, setNumber] = useState('');
  const [testNumber, setTestNumber] = useState(true);
    <link href="https://fonts.googleapis.com/css2?family=Poppins&family=Work+Sans:wght@300&display=swap" rel="stylesheet" />;
    return (
      <div>
        {
      !user.phone ? (
        <div>
          <h1 id="enter-number-header"> enter phone number to receive notifications:</h1>
          <input id="enter-number-box" onChange={(e) => setNumber(e.target.value)} placeholder="Ex:555XXXXXXX" />
          <button
            id="enter-number-button"
            onClick={() => {
              if (number.length >= 10 && !Number.isNaN(Number(number))) {
                setTestNumber('true');
                axios.post('/number', { number })
                  .then(() => axios.get('/user'))
                  .then((result) => {
                    setUser(result.data);
                    const body = 'Welcome to Show&Tell! Congrats on your first notification';
                    axios.get(`/notifs/${body}/null`);
                  });
              } else {
                setTestNumber(false);
              }
            }}
          >
            add number
          </button>
        </div>
      ) : (
        <div>
          <h1 id="header">Notifications</h1>
          <div id="change-number-msg"> want to change phone number currently receiving notifications? </div>
          <button
            id="change-number-button"
          >
            change number
          </button>
          <div id="all-notif"> All notifications:</div>
          <div>
            {
              user.notifs.map((text, i) => (
                <div id="notif-msg-block" key={text + i}>
                  <h2 id="receive-notifs-message">
                    {text}
                    <FaTrashAlt
                      title="delete notification"
                      id="trash-icon"
                      onClick={() => {
                        axios.delete(`/notifs/${i}`)
                          .then(() => {
                            axios.get('/user')
                              .then((result) => {
                                setUser(result.data);
                              });
                          });
                      }}
                    />
                  </h2>
                </div>
              ))
            }
          </div>
        </div>
      )
    }
        <div>{(testNumber) ? null : <p className="invalid-num-text">sorry, invalid number</p>}</div>
        <img id="notif-pic" src={pic} alt="pic" />
      </div>
    );
};

export default Notifs;
