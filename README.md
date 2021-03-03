# Remote Touchpad

This tool provides a web interface to control your computer's mouse. Simply open the web page on your phone!

Uses hammer.js for detecting touch gestures and RobotJS to control the computer.

## Build instructions

Take a look at hammer.js

You need to have yarn installed

``` sh
# install dependencies
yarn
sudo apt-get install libxtst-dev libpng++-dev
```

## Run the server

Run this to start the server:

```
yarn start
```

A web server will listen to port 3000 and will serve a web page to control your computer's mouse. The wep page is designed for touchscreen devices.

## API

### POST `/move`

- deltaX: number
- deltaY: number

### POST `/click`

- button: string

### POST `/scroll`

- deltaX: number
- deltaY: number

## TODO

- authentification
- performance improvements
- make ports configurable

## Frontend

- Touchpad Field
- Settings
