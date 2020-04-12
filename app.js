const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { shuffle } = require('./util')

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wsServer = new WebSocket.Server({ server });

const users = {}
const connections = {}

// WebSocket server
wsServer.on('connection', ws => {
  const uuid = uuidv4();
  console.log('New websocket connection', uuid)
  ws.send(JSON.stringify({
    command: 'newConnection',
    uuid
  }))

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  ws.on('message', function(message) {
    if (message.utf8Data) {
      const data = JSON.parse(message.utf8Data) // {"name":"Ian","message":"Hi"}
      console.log('New message:', data)

      const command = data.command
      switch (command) {
        case 'newUser':
          newUser(data, ws)
          break;
        case 'assignStoryteller':
          assignStoryteller(data)
          break;
        case 'assignRoles':
          assignRoles(data)
          break;
        default:
          noCommand(data, ws)
      }
    }
  });

  ws.on('close', function(connection) {
    // close user connection
  });
});

//start our server
server.listen(process.env.PORT || 1337, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

const newUser = (data, connection) => {
  users[data.uuid] = {
    name: data.name
  }
  connection.send(JSON.stringify({command:'joinLobby', users}))
}

const assignStoryteller = (data) => {
  const user = users[data.uuid]
  user.storyteller = true
  console.log(users)
}

const assignRoles = (data) => {
  const roles = shuffle(data.roles)
  Object.entries(users).forEach(entry => {
    const [ uuid, user ]= entry
    user.role = roles.pop()
    connections[uuid].send(JSON.stringify({command:'role', role: user.role}))
  })
  console.log(users)
}

const noCommand = ({ command }, connection) => {
  connection.send(`Command "${command}" not found`)
}