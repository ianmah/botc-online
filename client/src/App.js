import React from 'react'
import styled from 'styled-components'

import logo from './assets/demon-head.png'

import { Gameboard } from './Gameboard'
import { NameInput } from './NameInput'

//Localstorage Key
const BOTC_GAME_SESSION = 'BOTC_GAME_SESSION'

//Clients Commands
const NEW_USER = 'newUser'
const REJOIN_LOBBY = 'rejoinLobby'

//Server Response Commands
const NEW_CONNECTION = 'newConnection'
const JOIN_LOBBY = 'joinLobby'
const FAILED = 'failed'
const USER_JOIN = 'userJoin'
const USERS_UPDATE = 'usersUpdate'

const AppContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`

const Logo = styled.img`
  height: 200px;
  width: 200px;
`

class App extends React.Component {
  constructor(props) {
    super(props)

    this.websocket = null
    this.state = {
      openConnection: false,
      uuid: '',
    }
  }

  async componentDidMount() {
    await this.initWebSocket()
  }

  initWebSocket = async () => {
    this.websocket = new WebSocket(`ws://localhost:1337`)
    this.websocket.onopen = (evt) => this.onOpen(evt)
    this.websocket.onclose = (evt) => this.onClose(evt)
    this.websocket.onmessage = (evt) => this.onMessage(evt)
    this.websocket.onerror = (evt) => this.onError(evt)
  }

  onOpen = () => {
    console.log('Opening Connection...')
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
    console.log(`Error on: ${evt.data}`)
  }

  onMessage = (event) => {
    const eventObj = JSON.parse(event.data)
    switch (eventObj.command) {
      case NEW_CONNECTION:
        this.setState({ uuid: eventObj.uuid, openConnection: true })
        break
      case JOIN_LOBBY:
        localStorage.setItem(BOTC_GAME_SESSION, JSON.stringify(eventObj))
        this.setState({ inGame: true })
        break
      case FAILED:
        localStorage.removeItem(BOTC_GAME_SESSION)
        this.setState({ inGame: false })
        break
      case USERS_UPDATE:
        this.setState({ users: eventObj.users})
        break
      default:

    }
  }

  render() {
    const { openConnection, inGame } = this.state

    if (!openConnection) {
      return <div>Contacting server...</div>
    }

    const lsGameSession = JSON.parse(localStorage.getItem(BOTC_GAME_SESSION))
    if (openConnection && !inGame && lsGameSession && lsGameSession.uuid) {
      this.doSend({ command: REJOIN_LOBBY, uuid: lsGameSession.uuid })
    }

    const lsGameSession = localStorage.getItem(BOTC_GAME_SESSION)
    if (lsGameSession && lsGameSession.uuid) {
      this.doSend({ command: REJOIN_LOBBY, uuid: lsGameSession.toJSON().uuid })
      return <div>OH! You're in a game. Please wait....</div>  
    }

    return (
      <AppContainer>
        {inGame ? (
          <Gameboard />
        ) : (
          <React.Fragment>
            <h1>Blood on the Clocktower</h1>
            <Logo src={logo} alt={''} />
            <h2>Unofficial App</h2>
            <NameInput />
          </React.Fragment>
        )}
      </AppContainer>
    )
  }
}

export default App
