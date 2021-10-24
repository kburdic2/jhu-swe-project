const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// add user interface path to be served to client
var uiPath = path.join(__dirname, 'ui');


// create a player class to instantiate unique ids 
var player1_id = -1;
var player2_id = -1;
var player3_id = -1;
var name1 = '';
var name2 = '';
var name3 = '';

app.use(express.static(uiPath));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('connect-event', (msg) => {
    console.log('received connect-event');

    if(player1_id == -1)
    {
      player1_id = msg.ID;
      name1 = msg.Name;
      console.log("Player1 ID: " + player1_id);
      console.log("Player1 Name: " + name1);
    }
    else if (player2_id == -1)
    {
      player2_id = msg.ID;
      name2 = msg.Name;
      console.log("Player2 ID: ", player2_id);
      console.log("Player2 Name: " + name2);

    }
    else if (player3_id == -1)
    {
      player3_id = msg.ID;
      name3 = msg.Name;
      console.log("Player3 ID: ", player3_id);
      console.log("Player3 Name: " + name3);
    }
    else
    {
      // TODO: handle event max player event by denying connection 
      console.log("ERROR: max number of players reached.");
    }

    socket.on('update-event', () => {
      //broadcast player ids to all players
      socket.emit('player-ids', {"player1_ID": player1_id, 
                                 "player2_ID": player2_id,
                                 "player3_ID": player3_id});
      socket.emit('player-names', {"Name1": name1,
                                   "Name2": name2,
                                   "Name3": name3});                         
    })
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});