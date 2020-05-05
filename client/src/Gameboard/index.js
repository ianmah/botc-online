import React from 'react'

export const Gameboard = (props) => {
    return (
        <React.Fragment>
            <header>IN BOTC GAME</header>
            {props.users ? props.users.map (user=> {
                return <li key={user.name}>{user.name}</li>
            }): null}
        </React.Fragment>
    )
}