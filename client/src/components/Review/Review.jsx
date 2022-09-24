import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import pic from '../CreatePost/createpost.png';

const Review = ({ user, createPost }) => {
  const [game, setGame] = useState('none');
  const [gameSubs, setGameSubs] = useState([]);
  const [gotSubs, setGotSubs] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);
  const [error, setError] = useState('');
  const uploadedImg = useRef(null);
  const imgUploader = useRef(null);

  const onClick = () => {
    if (game !== 'none' && title !== '') {
      if (img === null) {
        console.log(game, 'game.....');
        createPost({
          title,
          content: { text: content, pic: img },
          topic_id: game,
          type: 'game',
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
              topic_id: game,
              type: 'game',
              poster: user._id,
            });
          })
          .catch();
        setTitle('');
        setContent('');
      }
    } else if (title === '') {
      setError('Must have a title.');
    } else if (game === 'none') {
      setError('Please choose a game to review.');
    }
  };

  const getSubs = () => {
    if (!gotSubs && user) {
      // const endpoints = user.gameSubscriptions.map(
      //   (sub) => `https://store.steampowered.com/api/appdetails?appids=${sub}`
      // );
      // axios
      //   .all(endpoints.map((endpoint) => axios.get(endpoint)))
      //   .then((result) => {
      //     console.log("result",result);
      //     setGotSubs(true);
      //     setGameSubs(result);
      //   })
      //   .catch((err) => console.error(err));

      const promises = user.gameSubscriptions.map((gameId) => axios.get(`/game/subscribed/${gameId}`)
        .catch((err) => console.log(err)));
      Promise.all(promises)
        .then((results) => {
          return results.map((sub) => sub.data);
        })
        .then((games) => {
          setGameSubs(games);
          setGotSubs(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const config = {
  //   method: 'post',
  //   url: 'http://localhost:8080/reviews',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data,
  // };

  // axios(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  useEffect(() => {
    if (user) {
      getSubs();
    }
  }, [gameSubs]);

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
      <h1 id="header">Create a Review</h1>
      <div id="post-sub-header"> share your reviews with the world!</div>
      <div className="create-post-form">
        <select
          className="choose-show"
          onChange={(e) => setGame(e.target.value)}
        >
          <option className="choose-show" value="none">
            What game do you want to review?
          </option>
          {gameSubs.map((sub, i) => (
            <option key={sub + i} value={sub.id}>
              {sub.name || sub.title}
            </option>
          ))}
          {getSubs()}
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
export default Review;
