import React from 'react'

import * as constants from '../constants'
import wsClient from '../__lib__/wsClient'

export class NameInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.storytellerRef = React.createRef()
  }

  handleInputChange(evt) {
    //Do input validation/error handling
  }

  onSubmit() {
    // console.log(this.inputRef.current.value)
    const name = this.inputRef.current.value
    const isStoryteller = this.storytellerRef.current.checked
    wsClient.sendMessage(constants.NEW_USER, {
      name,
      storyteller: isStoryteller,
    })
  }

  render() {
    return (
      <div>
        <input
          ref={this.inputRef}
          onChange={this.handleInputChange}
          placeholder={'Type name...'}
        />
        <br />
        <label>
          <input type='checkbox' ref={this.storytellerRef} id='storyteller' />I
          am the storyteller
        </label>
        <br />
        <button onClick={() => this.onSubmit()}>Connect to Game</button>
      </div>
    )
  }
}
