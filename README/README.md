# Show & Tell

![Show & Tell Home Page](homePage.png)

## Project Overview

Tired of finishing an AMAZING game or tv show and having no one to talk to about it? Show & Tell is a global community of Game/TV fans. Here you can create a personalized feed of your favorite content, show some love for your favorite games/shows, post, and follow user
with a like! Inspired by reddit.

## How to Interact w/ Show & Tell

- The first page you see will require you to login with a google account.
- In the search bar located in the upper right, search your favorite show and when the results populate, click a show to subscribe to it.
- The star in the nav bar will give you a list of your subscriptions.
- Now create your first post. Hit the pencil in the nav bar, choose one of the shows you are subscribed to, and write whatever your heart desires. Press "Submit Post" and your post will be live for all to see.
- The bell icon will allow you to input your cell number and receive notifications.
- The envelope gives you the ability to send direct messages to other users.
- The FaFantasyFlightGames icon will bring you to a page where you can search for  videogames, and once you do search for one, they will populate on the screen, and you will also have the ability to subscribe to each game that you will be able to see in the 'reviews' component 

## Tech Stack - MERN

1. MongoDB/Mongoose (/5.10.15)
2. Express Server (4.17.1)
3. React (17.0.1)
4. NodeJS (8.17.0)
5. Passport/Google OAuth (0.4.1 / 2.0.0)
6. PeerJS/ Peer server (1.3.2 / 0.6.1)

## APIs

1. Twilio ( 3.52.0 - [Twilio API Docs](https://www.twilio.com/docs/api) ) have to pay to notify users (deprecated API)
2. TV Maze ([TV Maze API Docs](https://www.tvmaze.com/api))
3. Youtube ([Youtube API Docs](https://developers.google.com/youtube/v3))
4. Cloudinary ([Cloudinary Docs](https://cloudinary.com/documentation/image_video_and_file_upload))
5. Steam API ([Official Steam API DOCS](https://steamcommunity.com/dev))
6. Steam API ([Unofficial Steam API DOCS](https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI))
7. Steamspy API ([Steamspy API Docs](https://steamspy.com/api.php))
8. Steam achievements API ([Achievements stats API](https://www.achievementstats.com/index.php?action=api))
9. Telegram Bot API ([Telegram Bot Webhooks API](https://core.telegram.org/bots/api#setwebhook)) Telegram Bot webhook format: https://${siteUrl}/game/newUser

## Project Setup

This section will discuss what is needed to get the project up and running on your local machine.

### What to Add to Your .env

1. Steam archive key go to [Steam Api]() 
2. In the Google Developers Console, generate a CLIENT ID and CLIENT SECRET.
3. Visit [MongoDBs Cloud Atlas](https://www.mongodb.com/cloud/atlas), create a free account, and auto-generate a secure password.
4. Go to [Cloudinary](https://cloudinary.com/), create a free account and configure your API KEY, SECRET, and CLOUD NAME

### Scripts to Run

```
npm install - to install all dependencies
```

```
npm run build - runs webpack and creates your build
```

```
npm start - starts up the server
```

## How to Contribute

[Contribute to Show & Tell](/CONTRIBUTING.md)

## Where to Find...

- **Components Entry Point** - client/src/index.jsx
- **Components** - You will find all component files located at client/src/components, where each component can be found in it's corresponding directory.
- **Database** - database schema and connection files can be found at server/db
- **Server** - all routes will be found at server/index.js

## Schema Design

![Schema Design](Schema.png)

## Further Development

- **rendering new components** - include your component following the syntax in the getView function in app.jsx, you can also add a clickable icon to the navbar in nav.jsx
- **passing down data** - essential data such as user data, is passed down in the app.jsx file as well
- **GameNWatch** - Components for GameNWatch are using state inside the component themselves unlike the rest of ShowNTell
- **Routes** - all ShowNTell request routes are defined in the servers index.js file, GameNWatch request routes are defined inside the servers routes folder
- **GamesNDB** - when searching a game by name, a list of results are saved into the database and returned, in this regard no data from the api is directly used inside the client, 
an exception to this is the recommended games component which has no save game functionality and strictly is displaying database from that API.
- **Warning!!!** - The MovieDB API was broken during development of GameNWatch. Steam API documentation is very limited, don't spend too much time searching these docs and instead make simple google searches to find information you might need.
