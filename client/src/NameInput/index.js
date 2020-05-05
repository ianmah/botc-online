import React from 'react'

const NEW_USER = 'newUser'

export class NameInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  doSend = (data) => {
    if (this.props.websocket) {
      this.props.websocket.send(JSON.stringify(data))
    }
  }

  handleInputChange(evt) {
    //Do input validation/error handling
  }

  onSubmit() {
    // console.log(this.inputRef.current.value)
    const name = this.inputRef.current.value
    this.doSend({ command: NEW_USER, name })
  }

  render() {
    return (
      <div>
        <input ref={this.inputRef} onChange={this.handleInputChange} placeholder={'Type name...'} />
        <button onClick={() => this.onSubmit()}>
          Connect to Game
        </button>
      </div>
    )
  }
}
