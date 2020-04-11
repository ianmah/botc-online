const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { shuffle } = require('./util')

const app = express();

//initialize a simple http server
const httpServer = http.createServer(app);

//initialize the WebSocket server instance
const wsServer = new WebSocketServer({ httpServer });

const users = []

// WebSocket server
wsServer.on('request', request => {
  const connection = request.accept(null, request.origin);
  const uuid = uuidv4();
  console.log('New websocket connection', uuid)
  connection.send(JSON.stringify({
    command: 'newConnection',
    uuid
  }))

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', message => {
    if (message.utf8Data) {
      const data = JSON.parse(message.utf8Data) // {"name":"Ian","message":"Hi"}
      console.log('New message:', data)

      const command = data.command
      switch (command) {
        case 'newUser':
          newUser(data, connection)
          break;
        case 'assignStoryteller':
          assignStoryteller(data)
          break;
        case 'assignRoles':
          assignRoles(data)
          break;
        default:
          noCommand(data, connection)
      }
    }
  });

  connection.on('close', connection => {
    // close user connection
  });
});

//start our server
httpServer.listen(process.env.PORT || 1337, () => {
  console.log(`Server started on port ${httpServer.address().port} :)`);
});

const newUser = (data, connection) => {
  const user = {
    name: data.name,
    connection
  }
  users[uuid] = user
  console.log(users)
  connection.send(JSON.stringify({command:'joinLobby', users}))
}

const assignStoryteller = (data) => {
  const user = users[data.uuid]
  user.storyteller = true
  console.log(users)
}

const assignRoles = (data) => {
  const roles = shuffle(data.roles)
  users.forEach(user => {
    user.role = roles.pop()
    user.connection.send(JSON.stringify({command:'role', role: user.role}))
  })
  console.log(users)
}

const noCommand = ({ command }, connection) => {
  connection.send(`Command "${command}" not found`)
}