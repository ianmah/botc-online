import React from 'react'

import * as constants from '../constants'
import websocket from '../Websocket'

const DISCONNECT = 'disconnect'

export const Gameboard = (props) => {
    const onDisconnect = () => {
        websocket.send(JSON.stringify({ command: DISCONNECT }))
        localStorage.removeItem(constants.BOTC_GAME_SESSION)
        websocket.close();
    }

    return (
        <React.Fragment>
            <header>IN BOTC GAME</header>
            {props.users ? props.users.map (user=> {
                return <li key={user.name}>{user.name}</li>
            }): null}
            <button onClick={() => onDisconnect()}>
              Disconnect
            </button>
        </React.Fragment>
    )
}