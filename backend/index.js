// this is file contains the main functionality of the remote touchpad
// you can connect with any WebSocket library and control the mouse

const robot = require('robotjs')
const WebSocket = require('ws')
const express = require('express')
const qr = require('qrcode')
const open = require('open')
const os = require('os')

function acceleratedDelta(body, sensitivity) {
    return {
        x: Math.sign(body.deltaX) * Math.ceil(body.deltaX * sensitivity * body.velocityX),
        y: Math.sign(body.deltaY) * Math.ceil(body.deltaY * sensitivity * body.velocityY),
    }
}

function getMyIP() {
    // what's my ip
    // inspired by https://stackoverflow.com/a/8440736
    const addresses = Object.values(os.networkInterfaces()).reduce((prev, ifaces) => {
        const ifAddresses = ifaces
        .map((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return undefined
            }
            return iface.address
        })
        .filter(v => v !== undefined)
        return [...prev, ...ifAddresses]
    }, []);
    if (addresses.length > 1) {
        console.warn('Not tested')
    } else if (addresses.length === 0) {
        console.warn('Could not determine the address of your computer. Check your internet connection and restart the server')
    }
    return addresses[0]
}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        if (data.type === 'click') {
            robot.mouseClick(data.button)
        } else if (data.type === 'move') {
            const mousePos = robot.getMousePos()
            const move = acceleratedDelta(data, 2.0)
            robot.moveMouse(mousePos.x + move.x, mousePos.y + move.y)
        } else if (data.type === 'scroll') {
            const move = acceleratedDelta(data, 2.0)
            robot.scrollMouse(move.x, move.y)
        }
    })
})

const app = express()
const port = 3000

app.use('/', express.static('frontend'))

app.get('/qr', (req, res) => {
    qr.toBuffer(`http://${getMyIP()}:${port}`, { type: 'png' })
        .then(buffer => {
            res.type("png")
            res.send(buffer);
        })
        .catch(console.error);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    // open a web page with instructions on how to use the software
    open(`http://${getMyIP()}:${port}/instructions.html`)
})
