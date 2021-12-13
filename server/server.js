const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { randomUUID } = require('crypto');
const io = new Server(server);

// add user interface path to be served to client
var uiPath = path.join(__dirname, 'ui');
app.use(express.static(uiPath));

// ID to check behavior
var SERVERID = "";
var HOSTPLAYER = "";
var HOSTID = "";

// create a player class to instantiate unique ids 
var player1_id = -1;
var player2_id = -1;
var player3_id = -1;
var playerCount = 0;
var name1 = '';
var name2 = '';
var name3 = '';
var buzzerFlag = false;
var currPlayerID = 0;
var timestamps = [0, 0, 0];

// map for users socket IDs
var userSocketIdMap = new Map(); 

// add client to known users map
function addClient(id, socketId)
{
  if(!userSocketIdMap.has(id))
  {
    userSocketIdMap.set(id, socketId);
  }
  else
  {
    userSocketIdMap.get(id).add(socketId);
  }
}

// remove client from known users map
function removeClient(socketId)
{
  const ids = [player1_id, player2_id, player3_id];

  for (let i = 1; i <= 3; i++)
  {
    if (ids[i] == socketId)
    {
      if (i == 1) player1_id = -1;
      if (i == 2) player2_id = -1;
      if (i == 3) player3_id = -1;
    }

    if(userSocketIdMap.has(ids[i]))
    {
      let userSocketIdValue = userSocketIdMap.get(ids[i]);
      
      if(userSocketIdValue === socketId)
      {
        userSocketIdMap.delete(ids[i]);
        console.log('user: ', ids[i], ' disconnected/deleted');
      }
    }
  }
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('connect-event', (msg) => {
    console.log('received connect-event');
    playerCount+=1

    // add client to users list
    addClient(playerCount, socket.id);  

    if(playerCount <= 3)
    {
      if(player1_id == -1)
      {
        player1_id = playerCount;
        name1 = msg.Name;
        console.log("Player1 ID: " + player1_id);
        console.log("Player1 Name: " + name1);
        
        // add msg to sync users with HOSTID and serverID
        HOSTPLAYER = name1; 
        HOSTID = userSocketIdMap.get(HOSTPLAYER);
        SERVERID = randomUUID;
        // send msg to other players with hostID and serverID information 
      }
      else if (player2_id == -1)
      {
        player2_id = playerCount;
        name2 = msg.Name;
        console.log("Player2 ID: ", player2_id);
        console.log("Player2 Name: " + name2);
      }
      else // (player3_id == -1)
      {
        player3_id = playerCount;
        name3 = msg.Name;
        console.log("Player3 ID: ", player3_id);
        console.log("Player3 Name: " + name3);
      }
    }
    else
    {
      console.log("Game only handles 3 players...")
    }

    // log entries of map 
    for(let [key, value] of userSocketIdMap)
    {
      console.log('logging user: ' + key + "=" + value);
    }

    io.emit('player-info', {"player1_ID": player1_id, 
                                "player2_ID": player2_id,
                                "player3_ID": player3_id,
                                "Name1": name1,
                                "Name2": name2,
                                "Name3": name3});

    if (playerCount != 1)
    {
      socket.emit('not-host');
    }
    
  });

  socket.on('start-game', (msg) => {
    io.emit('starting-game', {"numQuestions": msg.numQuestions,
                              "qBank": msg.qBank,
                              "rCate": msg.rCate});
  });

  socket.on('spin-wheel', (msg) => {
    socket.broadcast.emit('spinning-wheel', {"angVel": msg.angVel});
  });

  socket.on('pv-chosen', (msg) => {
    io.emit('pv-chosen-replicated', {"pv": msg.pv});
  });

  socket.on('buzzed-in', (msg) => {
    console.log("buzzed in!");
    for(let [key, value] of userSocketIdMap)
    {
      if (socket.id == value)
      {
        console.log(key);
        timestamps[key-1] = msg.timeClicked;
        console.log(timestamps);
      }
    }
    setTimeout(waitForTimestamps, 100);
  });

  function waitForTimestamps()
  {
    console.log("waitForTimestamps");
    if (timestamps.slice(0,3).includes(0))
    {
      setTimeout(waitForTimestamps, 100);
    }
    else
    {
      var shortestTime = 0;
      var shortestTimePlayerID = 0;
      for (let i = 0; i < 3; i++)
      {
        if (shortestTime == 0 || timestamps[i] < shortestTime)
        {
          shortestTime = timestamps[i];
          shortestTimePlayerID = i+1;
        }
      }
      console.log("shortest time:");
      console.log(shortestTime);
      if (shortestTime != 9999999999)
      {
        setCurrentPlayer(shortestTimePlayerID);
      }
      else
      {
        io.emit('buzzer-timed-out');
      }
      timestamps = [0, 0, 0];
    }
  }

  function setCurrentPlayer(ID)
  {
    for(let [key, value] of userSocketIdMap)
    {
      if (ID == key)
      {
        socket.to(value).emit('set-currentPlayer', {'currPlr': ID});
      }
      else
      {
        socket.to(value).emit('set-not-currentPlayer', {'currPlr': ID});
      }
    }
  }

  socket.on('update-ui', (msg) => {
    console.log('recv update-ui msg from: ', socket.id);

    const names = [name1, name2, name3];
    var recvSocketIds = [];

    msg.player1Name = name1;
    msg.player2Name = name2;
    msg.player3Name = name3;

    for (let i = 0; i < 3; i++)
    {
      if(userSocketIdMap.has(names[i]))
      {
        recvSocketIds[i] = userSocketIdMap.get(names[i]);  
      }
    }

    for (let i =0; i < 3; i++)
    {
      // emit to all socket IDs in map
      socket.to(recvSocketIds[i]).emit('update-ui', msg);
    }
  
    /*socket.emit('update-ui', msg); 
    
                         msg = {"wheelColor": "",
                                "wheelCategory": "",
                                "currentPlayer": player.SocketID,
                                "hostPlayer": HOSTID,
                                "player1Points": 0,
                                "player2Points": 0,
                                "player3Points": 0,
                                "questionsLeft": "",
                                "currentQuestion": "",
                                "answer": 1,
                                "optionA": "",
                                "optionB": "",
                                "optionC": "",
                                "optionD": "",
                                "serverID": serverId
                                })

    */
  })

  socket.on('update-question', (msg) => {

    const names = [name1, name2, name3];
    var recvSocketIds = [];

    //TODO: input some error handling

    for (let i = 0; i < 3; i++)
    {
      if(userSocketIdMap.has(names[i]))
      {
        recvSocketIds[i] = userSocketIdMap.get(names[i]);  
      }
    }

    for (let i =0; i < 3; i++)
    {
      // emit to all socket IDs in map
      socket.to(recvSocketIds[i]).emit('update-question', msg);
    }

    /*
    socket.emit('update-question', msg);
    {"currentCategory": "",
     "currentQuestion": "",
     "answer": 1,
     "optionA": "",
     "optionB": "",
     "optionC": "",
     "optionD": "",
     "serverID": SERVERID
    }

    })
    */
  })

  socket.on('update-game-state', (msg) => {

    const names = [name1, name2, name3];
    var recvSocketIds = [];

    //TODO: input some error handling

    for (let i = 0; i < 3; i++)
    {
      if(userSocketIdMap.has(names[i]))
      {
        recvSocketIds[i] = userSocketIdMap.get(names[i]);  
      }
    }

    for (let i =0; i < 3; i++)
    {
      // emit to all socket IDs in map
      socket.to(recvSocketIds[i]).emit('update-question', msg);
    }

    /* TODO basic error handling
    if(SERVERID === msg.serverID)
    {
      // check if socket ID is in the map too? 
      // emit to other clients
    }
    else
    {
      console.log("recv update-game-state: wrong server ID");
    }
    */

    /*
    socket.emit('update-game-state', msg);
    
    msg =   {"questionsLeft": 0,
             "currentPlayer": 0,
             "hostPlayer": HOSTID,
             "serverID": SERVERID
            }
    */
  })

  socket.on('score-update', (msg) => {

    if(SERVERID === msg.serverID)
    {
      // check if socket ID is in the map too? 
      // emit to other clients
    }
    else
    {
      console.log("recv score-update: wrong server ID");
    }

    /*
    socket.emit('score-update', msg);
    
    msg =   {"playerScore": 0,
             "playerID": "",
             "serverID": SERVERID
            }
    */
  })

  socket.on('buzz-in', (msg) => {

    if(SERVERID === msg.serverID)
    {
      // update the current player
      if(!buzzerFlag)
      {
        //currentPlayer = socket.id;
        buzzerFlag = true;
        // TODO: need to check game to know when to reset buzzerFlag 
      }

    }
    else
    {
      console.log("recv buzz-in: wrong server ID");
    }

    /*
    socket.emit('buzz-in', msg);
    
    msg =   {"timeClicked": 0,
             "playerID": "",
             "serverID": SERVERID
            }
    */
  })

  socket.on('disconnect', () => {
      console.log('user disconnected');

      // remove Client from map
      removeClient(socket.id);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});