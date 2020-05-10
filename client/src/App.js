import React from 'react'
import styled from 'styled-components'
import wsClient from './__lib__/wsClient'
import * as constants from './constants'

import logo from './assets/demon-head.png'

import { Gameboard } from './Gameboard'
import { NameInput } from './NameInput'
import { Storyteller } from './Storyteller'

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

    this.state = {
      openConnection: false,
      uuid: '',
    }
  }

  componentDidMount() {
    wsClient.initialize()
    this.unsubscribe = wsClient.subscribe(this.onMessage)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidUpdate() {
    const { openConnection, inGame } = this.state

    // Rejoin game check
    const lsGameSession = JSON.parse(
      localStorage.getItem(constants.BOTC_GAME_SESSION),
    )
    if (openConnection && !inGame && lsGameSession && lsGameSession.uuid) {
      wsClient.sendMessage(constants.NEW_USER, { uuid: lsGameSession.uuid })
    }
  }

  onClose = () => {
    console.log('Closing Connection...')
    this.setState({ openConnection: false, inGame: false })
  }

  onMessage = (data) => {
    const { command } = data
    switch (command) {
      case constants.NEW_CONNECTION:
        this.setState({ uuid: data.uuid, openConnection: true })
        break
      case constants.JOIN_LOBBY:
        localStorage.setItem(constants.BOTC_GAME_SESSION, JSON.stringify(data))
        this.setState({ inGame: true, storyteller: data.storyteller })
        break
      case constants.FAILED:
        localStorage.removeItem(constants.BOTC_GAME_SESSION)
        this.setState({ inGame: false })
        break
      case constants.USERS_UPDATE:
        this.setState({ users: data.users })
        break
      default:
        console.log(data)
        break
    }
  }

  render() {
    const { openConnection, inGame } = this.state

    if (!openConnection) {
      return <header>Connecting to server...</header>
    }

    if (inGame) {
      return (
        <AppContainer>
          <Gameboard users={this.state.users} onDisconnect={this.onClose} />
          {this.state.storyteller ? <Storyteller /> : null}
        </AppContainer>
      )
    }

    return (
      <AppContainer>
        <h1>Blood on the Clocktower</h1>
        <Logo src={logo} alt={'big ugly face'} />
        <h2>Unofficial App</h2>
        <NameInput />
      </AppContainer>
    )
  }
}

export default App
