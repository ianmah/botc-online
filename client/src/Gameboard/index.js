import React from 'react'

import * as constants from '../constants'
import wsClient from '../__lib__/wsClient'

export class Gameboard extends React.Component {
  componentDidMount() {
    this.unsubscribe = wsClient.subscribe(this.onMessage)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  onDisconnect = () => {
    wsClient.sendMessage(constants.DISCONNECT, {})
    localStorage.removeItem(constants.BOTC_GAME_SESSION)
    wsClient.close()
  }

  onMessage = (data) => {
    const { command } = data
    switch (command) {
      // case constants.USERS_UPDATE:
      //   this.setState({ users: data.users })
      //   break
      default:
        break
    }
  }

  render() {
    const { users, onDisconnect } = this.props

    return (
      <React.Fragment>
        <header>IN BOTC GAME</header>
        {users
          ? users.map((user) => {
              return <li key={user.name}>{user.name}</li>
            })
          : null}
        <button onClick={() => onDisconnect()}>Disconnect</button>
      </React.Fragment>
    )
  }
}
