# Reddit /r/place BOT

Design and apply pixel art to [reddit's /r/place](https://reddit.com/r/place)

## Install

**NOTE:** If you are using M1 mac and have issue installing node-canvas, [see this comment](https://github.com/Automattic/node-canvas/issues/1733#issuecomment-808916786);

```bash
yarn install
```

## Setup

Copy the `.env.example` file to `.env` and edit the `BOT_CREDENTIALS` and `BOT_DESIGNS` with your own config

### Creating designs

There is a simple UI to design patterns. Run:

```bash
yarn start:ui
```

And then go to [http://localhost:1234]()

## Running

Make sure you

1. Created at least one design
1. Added your designs to the `.env` file
1. Added your credentials to the `.env` file

And then just run

```bash
yarn start:bot
```

## Project status

- Completed
    - login with username / password
    - place tiles
    - use multiple accounts
    - download all current images from /r/place and stitch them together ([thanks dsf3449](https://github.com/Zequez/reddit-placebot/issues/46#issuecomment-1086736236))
    - only place tiles that are different
- To Do
    - track cooldown status between restarts
    - handle errors, especially unforeseen timeout errors
    - import designs in the UI
