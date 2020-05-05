const websocket = new WebSocket(`ws://localhost:1337`)
websocket.onopen = (evt) => onOpen(evt)
websocket.onclose = (evt) => onClose(evt)
websocket.onmessage = (evt) => onMessage(evt)
websocket.onerror = (evt) => onError(evt)
websocket.doSend = (evt) => doSend(evt)

let onOpen = () => {
    console.log('Opening Connection...')
}

let onClose = () => {
    console.log('Closing Connection...')
}

let onError = (evt) => {
    console.log(`Error on: ${evt.data}`)
}

const doSend = (data) => {
    websocket.send(JSON.stringify(data))
}

let onMessage = (evt) => {
    console.log(`Message: ${evt.data}`)
}

export default websocket