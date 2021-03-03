const hammerElement = document.querySelector('#hammer')
const pingElement = document.querySelector('#ping')
const hammertime = new Hammer(hammerElement, {})
hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL })
hammertime.add(new Hammer.Tap({ event: 'twotap', pointers: 2, taps: 1 }))
hammertime.add(new Hammer.Pan({ event: 'scroll', pointers: 2 }))

let lastCenter
let lastScroll

const colourIdle = 'darkslategray'
const colourMove = '#5a9141'
const colourScroll = '#415a91'

// let pingQueue = []
// const maxPings = 5
// const minBadPing = 200

const ws = new WebSocket(`ws://${location.host}`)

// function addPing(ping) {
//     pingQueue.push(ping)
//     if (pingQueue.length > maxPings) {
//         pingQueue.shift()
//     }
// }

// function avgPing() {
//     return pingQueue.reduce((prev, curr) => prev + curr) / pingQueue.length
// }

hammertime.on('panstart', (ev) => {
    lastCenter = ev.center
})

hammertime.on('pan', (ev) => {
    const deltaX = ev.center.x - lastCenter.x
    const deltaY = ev.center.y - lastCenter.y
    lastCenter = ev.center
    const t0 = performance.now()
    ws.send(JSON.stringify({
        type: 'move',
        deltaX,
        deltaY,
        velocity: ev.velocity,
        velocityX: ev.velocityX,
        velocityY: ev.velocityY,
    }))
    // .then(() => {
    //     let t1 = performance.now()
    //     addPing(t1 - t0)
    //     const ping = avgPing()
    //     pingElement.innerText = `Ping: ${ping.toFixed(2)}ms${ping > minBadPing ? '!' : ''}`
    // }).catch((err) => console.error(err))
    hammerElement.style.backgroundColor = colourMove
})

hammertime.on('panend', () => {
    hammerElement.style.backgroundColor = colourIdle
})

hammertime.on('tap', () => {
    ws.send(JSON.stringify({
        type: 'click',
        button: 'left',
    }))
})

hammertime.on('twotap', () => {
    ws.send(JSON.stringify({
        type: 'click',
        button: 'right',
    }))
})

hammertime.on('scrollstart', (ev) => {
    lastScroll = ev.center
})

hammertime.on('scroll', (ev) => {
    const deltaX = ev.center.x - lastScroll.x
    const deltaY = ev.center.y - lastScroll.y
    lastScroll = ev.center
    ws.send(JSON.stringify({
        type: 'scroll',
        deltaX,
        deltaY,
        velocityX: ev.velocityX,
        velocityY: ev.velocityY,
    }))

    hammerElement.style.backgroundColor = colourScroll
})

hammertime.on('scrollend', () => {
    hammerElement.style.backgroundColor = colourIdle
})
