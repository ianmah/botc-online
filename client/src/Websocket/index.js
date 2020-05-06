const Service = {
    websocket: {},
    initialize: function (onopen = null) {
        this.websocket = new WebSocket(`ws://localhost:1337`)
        this.websocket.onopen = (evt) => onopen(evt)
        this.websocket.onclose = (evt) => onClose(evt)
        this.websocket.onmessage = (evt) => onMessage(evt)
        this.websocket.onerror = (evt) => onError(evt)
        // this.websocket.doSend = (evt) => doSend(evt)
    },
    doSend: function (data) {
        this.websocket.send(JSON.stringify(data))
    }
}

// const websocket = new WebSocket(`ws://localhost:1337`)
// websocket.onopen = (evt) => onOpen(evt)
// websocket.onclose = (evt) => onClose(evt)
// websocket.onmessage = (evt) => onMessage(evt)
// websocket.onerror = (evt) => onError(evt)
// websocket.doSend = (evt) => doSend(evt)

let onOpen = () => {
    console.log('Opening Connection...')
}

let onClose = () => {
    console.log('Closing Connection...')
}

let onError = (evt) => {
    console.log(`Error on: ${evt.data}`)
}

let onMessage = (evt) => {
    console.log(`Message: ${evt.data}`)
}

export default Service