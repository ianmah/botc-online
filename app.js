const WebSocketServer = require('websocket').server;
const http = require('http');
const express = require('express');

const app = express();

//initialize a simple http server
const httpServer = http.createServer(app);

//initialize the WebSocket server instance
const wsServer = new WebSocketServer({ httpServer });

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log('New websocket connection')

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

//start our server
httpServer.listen(process.env.PORT || 1337, () => {
  console.log(`Server started on port ${httpServer.address().port} :)`);
});