import React from 'react'

const NEW_USER = 'newUser'

export class NameInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.storytellerRef = React.createRef()
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
    const isStoryteller = this.storytellerRef.current.checked
    this.doSend({
      command: NEW_USER,
      name, storyteller:
      isStoryteller
    })
  }

  render() {
    return (
      <div>
        <input ref={this.inputRef} onChange={this.handleInputChange} placeholder={'Type name...'} />
        <br/>
        <input type="checkbox" ref={this.storytellerRef} id="storyteller" />
        <label htmlFor="storyteller">I am the storyteller</label>
        <br/>
        <button onClick={() => this.onSubmit()}>
          Connect to Game
        </button>
      </div>
    )
  }
}
