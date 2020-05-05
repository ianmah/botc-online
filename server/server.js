import WebSocket from 'ws';
import http from 'http';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import shuffle from './util';
import * as commands from './constants';

const users = {}
const connections = {}
let storyteller = false

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('New Connection opened')
  ws.send(JSON.stringify({
    command: commands.NEW_CONNECTION
  }))

  ws.on('message', message => {
    console.log(`New message from ${ws.uuid}:\n    ${message}`)
    const data = JSON.parse(message) // {"command":"newUser","something":"Hi"}

    const command = data.command
    switch (command) {
      case commands.NEW_USER:
        newUser(data, ws)
        break;
      case commands.REJOIN_LOBBY:
        rejoinLobby(data, ws)
        break;
      case commands.DISCONNECT:
        disonnect(ws)
        break;
      case 'assignRoles':
        assignRoles(data)
        break;
      default:
        noCommand(data, ws)
    }
  });

  ws.on('close', ws => {
    // close user connection
  });
});

// start our server
server.listen(process.env.PORT || 1337, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

const newUser = (data, ws) => {
  const uuid = uuidv4();

  ws.uuid = uuid
  connections[uuid] = ws

  const user = {
    name: data.name
  }
  users[uuid] = user

  if (data.storyteller && !storyteller) {
    const user = users[uuid]
    user.storyteller = true
    storyteller = true
  }

  console.log('New user UUID:', uuid)

  // Respond to client
  ws.send(JSON.stringify({
    command: commands.JOIN_LOBBY,
    uuid,
    storyteller: user.storyteller
  }))

  // Broadcast to all clients new user has joined
  // broadcast(JSON.stringify({command: commands.USER_JOIN, user}))
  
  // update all clients' user name list
  broadcastUsers()

  console.log('users:', users)
}

const rejoinLobby = (data, ws) => {
  const uuid = data.uuid
  if (connections[uuid]) {
    ws.uuid = uuid
    connections[uuid] = ws
    console.log('Reconnected:', users[uuid].name)

    // Respond to client
    ws.send(JSON.stringify({
      command: commands.JOIN_LOBBY,
      uuid,
      storyteller: user[uuid].storyteller
    }))

    // Broadcast to all clients user has rejoined
    // broadcast(JSON.stringify({command:'userJoin', user}))

    // update all clients' user name list
    broadcastUsers()

    console.log(users)
  } else {
    console.log('Attempt to join null game:', uuid)
    ws.send(JSON.stringify({command: 'failed'}))
  }
}

const disonnect = (ws) => {
  const uuid = ws.uuid
  if (connections[uuid]) {
    console.log('Disonnect:', users[uuid].name)
    delete connections[uuid]
    delete users[uuid]

    // Respond to client
    // ws.send(JSON.stringify({command: commands.JOIN_LOBBY, uuid}))

    // update all clients' user name list
    broadcastUsers()

    console.log(users)
  } else {
    console.log('Attempt to disconnect null user:', uuid)
    ws.send(JSON.stringify({command: 'failed'}))
  }
}

const assignRoles = (data) => {
  const roles = shuffle(data.roles)
  Object.entries(users).forEach(entry => {
    const [ uuid, user ]= entry
    user.role = roles.pop()
    connections[uuid].send(JSON.stringify({command: 'role', role: user.role}))
  })
  console.log('users:', users)
}

const noCommand = (data, ws) => {
  console.log(`Command "${data.command}" not found`)
  ws.send(JSON.stringify(`Command "${data.command}" not found`))
}

const broadcast = (message) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const broadcastUsers = () => {
  const players = Object.values(users).map(user => ({ name: user.name }))
  broadcast(JSON.stringify({command: commands.USERS_UPDATE, users: players}))
}