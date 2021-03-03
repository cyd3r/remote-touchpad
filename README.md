# Remote Touchpad

This tool provides a web interface to control your computer's mouse. Simply open the web page on your phone!

Uses [hammer.js](https://hammerjs.github.io/) for detecting touch gestures and [RobotJS](http://robotjs.io/) to control the computer.

## Build instructions

Run `yarn` to install the required dependencies.

If there are issues using RobotJS, take a look here: http://robotjs.io/docs/building

## Run the server

Run this to start the server:

```
yarn start
```

A web server will listen to port 3000 and will serve a web page to control your computer's mouse. The wep page is designed for touchscreen devices.

## API

### POST `/move`

- `deltaX`: number
- `deltaY`: number

### POST `/click`

- `button`: string

### POST `/scroll`

- `deltaX`: number
- `deltaY`: number

## TODO

- authentification
- performance improvements
- make ports configurable

## Frontend

- Touchpad Field
- Settings
