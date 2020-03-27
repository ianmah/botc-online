const WebSocketServer = require('websocket').server;
const express = require('express');

const server = express();

const port = 3000
server.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Example app listening on port ${port}!`))

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
    }
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});