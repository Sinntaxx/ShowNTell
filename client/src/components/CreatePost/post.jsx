/* eslint-disable no-console */
import React, { useState, useRef } from 'react';
import axios from 'axios';
import pic from './createpost.png';
import './post.css';
// import { Image } from '@cloudinary/react'

const Post = ({ user, createPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [show, setShow] = useState('none');
  const [error, setError] = useState('');
  const [subs, setSubs] = useState([]);
  const [gotSubs, setGotSubs] = useState(false);
  const [movieSubs, setMovieSubs] = useState([]);
  const [gotMovieSubs, setGotMovieSubs] = useState(false);
  const [img, setImg] = useState(null);

  const uploadedImg = useRef(null);
  const imgUploader = useRef(null);

  const onClick = () => {
    if (show !== 'none' && title !== '') {
      if (img === null) {
        createPost({
          title,
          content: { text: content, pic: img },
          show,
          poster: user._id,
        });
        setTitle('');
        setContent('');
      } else {
        axios
          .post('/upload', { img })
          .then((id) => {
            createPost({
              title,
              content: { text: content, pic: id.data },
              show,
              poster: user._id,
            });
          })
          .catch();
        setTitle('');
        setContent('');
      }
    } else if (title === '') {
      setError('Must have a title.');
    } else if (show === 'none') {
      setError('Please choose a show to talk about.');
    }
  };

  const getSubs = () => {
    if (!gotSubs) {
      const promises = user.subscriptions.map((showId) => axios.get(`/show/${showId}`).catch());
      Promise.all(promises)
        .then((results) => results.map((sub) => sub.data))
        .then((shows) => {
          setSubs(shows);
          setGotSubs(true);
        })
        .catch();
    }
  };
  const getMovieSubs = () => {
    if (!gotMovieSubs) {
      const promises = user.movieSubscriptions.map((movieId) => axios.get(`/movie/${movieId}`).catch((err) => console.log(err)));
      Promise.all(promises)
        .then((results) => results.map((sub) => sub.data))
        .then((movies) => {
          setMovieSubs(movies);
          setGotMovieSubs(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();

      const { current } = uploadedImg;
      current.file = file;

      reader.readAsDataURL(file);
      reader.onload = (e) => {
        current.src = reader.result;
        setImg(reader.result);
      };
    }
  };

  return (
    <div>
      <h1 id="header">Create a post</h1>
      <div id="post-sub-header"> share your thoughts with the world!</div>
      <div className="create-post-form">
        <select
          className="choose-show"
          onChange={(e) => setShow(e.target.value)}
        >
          <option className="choose-show" value="none">
            What do you want to talk about?
          </option>
          {movieSubs.map((sub, i) => (
            <option key={sub + i} value={sub.id}>
              {sub.name || sub.title}
            </option>
          ))}
          {subs.map((sub, i) => (
            <option key={sub + i} value={sub.id}>
              {sub.name || sub.title}
            </option>
          ))}
          {getSubs()}
          {getMovieSubs()}
        </select>
        <div className="title-container">
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
          />
        </div>
        <div className="img-content-container">
          Post a meme!
          <input
            type="file"
            accept="image/*"
            ref={imgUploader}
            onChange={handleImageUpload}
            multiple={false}
            style={{ display: 'none' }}
          />
          <div
            id="img-content-sub-container"
            onClick={() => imgUploader.current.click()}
          >
            <img id="post-img" ref={uploadedImg} alt="" />
          </div>
        </div>
        <div className="content-container">
          <textarea
            id="post-text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="what's your message?"
          />
        </div>
        <button id="submit-button" onClick={onClick}>
          submit post
        </button>
        <h4 id="error-message">{error}</h4>
      </div>
      <img id="pic" src={pic} alt="pic" />
    </div>
  );
};

export default Post;
