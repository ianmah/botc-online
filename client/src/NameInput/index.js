import React from 'react'

const NEW_USER = 'newUser'

export class NameInput extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  handleInputChange(evt) {
    //Do input validation/error handling
  }

  onSubmit() {
    console.log(this.inputRef.current.value)
    // this.doSend({ command: NEW_USER, name: 'Ian' })
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
