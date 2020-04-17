import React from 'react'
import logo from './logo.svg'
import './App.css'

const REQUEST_CONNECTION = 'requestConnection'
const NEW_CONNECTION = 'newConnection'
const NEW_USER = 'newUser'
const JOIN_LOBBY = 'joinLobby'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.websocket = null
    this.state = {
      uuid: '',
      join: false,
    }
  }

  async componentDidMount() {
    await this.initWebSocket()
  }

  initWebSocket = async () => {
    this.websocket = new WebSocket(`ws://5759ac62.ngrok.io/`)
    this.websocket.onopen = (evt) => this.onOpen(evt)
    this.websocket.onclose = (evt) => this.onClose(evt)
    this.websocket.onmessage = (evt) => this.onMessage(evt)
    this.websocket.onerror = (evt) => this.onError(evt)
  }

  onOpen = () => {
    console.log('Opening Connection...')
    this.doSend({ command: REQUEST_CONNECTION })
  }

  onClose = () => {
    console.log('Closing Connection...')
  }

  doSend = (data) => {
    if (this.websocket) {
      this.websocket.send(JSON.stringify(data))
    }
  }

  onError = (evt) => {
    this.pushMessages(`Error on: ${evt.data}`)
  }

  onMessage = (event) => {
    const eventObj = JSON.parse(event.data)
    switch (eventObj.command) {
      case NEW_CONNECTION:
        this.setState({ uuid: eventObj.uuid })
        break
      case JOIN_LOBBY:
        this.setState({ isInGame: true })
        break
      default:
        console.log('unknown command')
    }
  }

  render() {
    const { uuid, isInGame } = this.state

    return (
      <div className='App'>
        {isInGame ? (
          <header>IN BOTC GAME</header>
        ) : (
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <button
              onClick={() =>
                this.doSend({ command: NEW_USER, uuid, name: 'Alex' })
              }
            >
              Connect to Game
            </button>
          </header>
        )}
      </div>
    )
  }
}

export default App
