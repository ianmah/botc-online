import { v4 as uuid } from 'uuid'

const WS_URL = `ws://localhost:1337`

let websocket = null
let wsSubscribers = new Map()

const onOpen = () => {
  console.log('Opening Connection...')
}

const onClose = () => {
  console.log('Closing Connection...')
}

const onError = (evt) => {
  console.log(`Error on: ${evt.data}`)
}

const onMessage = (evt) => {
  const eventData = JSON.parse(evt.data)
  wsSubscribers.forEach((notifyFunc) => notifyFunc(eventData))
}

export default {
  initialize: () => {
    websocket = new WebSocket(WS_URL)
    websocket.onopen = (evt) => onOpen(evt)
    websocket.onclose = (evt) => onClose(evt)
    websocket.onmessage = (evt) => onMessage(evt)
    websocket.onerror = (evt) => onError(evt)
  },

  sendMessage: (command, data) => {
    const payload = { command, ...data }
    websocket.send(JSON.stringify(payload))
  },

  close: () => {
    websocket.close()
  },

  subscribe: (notifyFunc) => {
    if (typeof notifyFunc === 'function') {
      const key = uuid()
      wsSubscribers.set(key, notifyFunc)
      return (uuid) => {
        wsSubscribers.delete(uuid)
      }
    }
  },
}
