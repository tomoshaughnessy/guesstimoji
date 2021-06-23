const utils = require('./utils.js');
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const moment = require('moment');
// game logic layer

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    },
});
console.log(process.env.ORIGINS);
const url = 'mongodb://127.0.0.1:27017/';
var roomHashTable = {};

const port = process.env.PORT || 5000;

// req object = THE http request
// res object = THE http response that the Express app sends
//              when it gets a request
// express.static(root) is a built-in middleware function

//app.use(path, express.static(__dirname+'/src'))
// when the client requests to use path
// express.static will serve __dirname/src/res.url to path
//app.use('/src', express.static(__dirname + '/src'));
// app.use(path, callback) is application level middleware
// middleware/HTTP request method model:
//
// client request ---> express server ---> response
// the express server is the middleware and runs
// the middleware functions
// the express server handles routing:
// app.METHOD(PATH, HANDLER)
// METHOD - http verb
// PATH - url which client sent METHOD
// HANDLER is executed when the METHOD is called on PATH

// ReactDOM in index.js doesn't render
// it probably doesn't render for the same reason
// it doesn't when opening index.html by itself
/*
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/index.html'))
});
*/
// server.js is a lot like a reducer
// logic should be here
// events represent action types
// data represents actions
// the hashtable should represent each rooms state tree
// each room should then have a games hash table
// representing the state tree of each game
// game : {1:
//            {board: board[1],
//             players: [,{username: 'player1', pick: '😋'},{username: 'player2', pick: '😋'}]
//             turn: [2,2],
//             roomFull: true,
//             gameLog:
//                [
//                  {username: 2, message: 'is it a mammal?'},
//                  {username: 1, message: 'Yes.'}
//                ]
//
//
//}}

/*
const insertRecordIntoCollection = (rec, coll) => {
  // mongoClient.connect(url, (err, db) => {
  mongoClient.connect(mongoDBStrings.connectionString, (err, db) => {
    if (err) throw err;
    var dbo = db.db("guesstimoji");
    dbo.collection(coll).insertOne(rec, (err, res) => {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}
*/
const validateBoardIndex = (index) => {
    if (typeof index != 'number') {
        console.log('Invalid index type %s', typeof index);
        return false;
    } else if (index < 0) {
        console.log('No negative board index: ', index);
        return false;
    } else if (index >= utils.BOARD_MAX_LENGTH) {
        console.log('Out of bounds of board ', index);
        return false;
    }
    return true;
};

const validateString = (string, key) => {
    const length = string.length;
    if (length <= 0) {
        console.log('%s is an empty string', key);
        return false;
    } else if (string.includes('<') || string.includes('>')) {
        console.log('Potential XSS attack %s', string);
        return false;
    }
    switch (key) {
        case 'message':
            if (length > utils.MESSAGE_MAX_LENGTH) {
                console.log(
                    '%s = %s, length of %d is bigger than max: %d',
                    key,
                    string,
                    length,
                    utils.MESSAGE_MAX_LENGTH
                );
                return false;
            }
            return true;
        case 'roomID':
            if (length > utils.ROOMID_MAX_LENGTH) {
                console.log(
                    '%s = %s, length of %d is bigger than max: %d',
                    key,
                    string,
                    length,
                    utils.ROOMID_MAX_LENGTH
                );
                return false;
            }
            return true;
        case 'pick':
            if (length > utils.PICK_MAX_LENGTH) {
                console.log(
                    '%s = %s, length of %d is bigger than max: %d',
                    key,
                    string,
                    length,
                    utils.PICK_MAX_LENGTH
                );
                return false;
            }
            return true;
        default:
            console.log('Unknown key in validation.');
            return false;
    }
};

// this is to prevent someone from sending objects
// of different shape
const validateObject = (data, valid) => {
    if (!data) {
        console.log('validateObject -> data = ', data);
        return false;
    }
    const dataKeys = Object.keys(data).sort();
    const validKeys = Object.keys(valid);
    if (JSON.stringify(dataKeys) !== JSON.stringify(validKeys)) {
        console.log("%o shape doesn't match shape of %o .", data, valid);
        return false;
    }
    for (key of dataKeys) {
        if (typeof data[key] !== valid[key]) {
            console.log(
                '%o.%s should be of type %s not of type %s',
                data,
                key,
                valid[key],
                typeof data[key]
            );
            return false;
        } else if (!data[key]) {
            console.log('validateObject -> data[key] = ', data[key]);
            return false;
        } else if (
            typeof data[key] === 'string' &&
            !validateString(data[key], key)
        ) {
            return false;
        } else if (key === 'player' && data[key] !== 1 && data[key] !== 2) {
            console.log('%d is not a valid player', player);
        }
    }
    return true;
};

// rooms data structure needs to be fixed
// I think rooms are handled server side,
// i.e., the client has no idea it's in a room
io.sockets.on('connection', (socket) => {
    socket.on('client:rooms/roomsRequested', () => {
        const roomIds = Object.keys(roomHashTable);
        console.log('rooms requested');
        // only show roomIds for which the room is not full
        socket.emit(
            'server:rooms/roomsResponded',
            roomIds.filter((id) =>
                roomHashTable[id] ? !roomHashTable[id].roomFull : false
            )
        );
    });

    socket.on('client:room/roomJoined', (joinData) => {
        if (!validateObject(joinData, utils.JOINDATA_TYPES)) {
            return;
        }
        const { roomID, board } = joinData;
        const serverFull =
            Object.keys(roomHashTable).length > utils.ROOMHASHTABLE_MAX_ENTRIES;
        if (serverFull) {
            console.log('Server full.');
            socket.emit('server:room/roomJoined', null);
            return;
        }
        socket.join(roomID);
        // entry shouldn't be deleted if room is full
        socket.on('disconnect', () => {
            // one player disconnected from the game
            if (roomHashTable[roomID].roomFull === true) {
                socket.to(roomID).emit('server:room/roomJoined', {
                    roomFull: false,
                    player: 1,
                });
                roomHashTable[roomID].roomFull = false;
                // player 1 disconnected
                if (roomHashTable[roomID].players[1].socketID === socket.id) {
                    // player 2 now player 1
                    roomHashTable[roomID].players[1] =
                        roomHashTable[roomID].players[2];
                }
                roomHashTable[roomID].players[2] = {
                    username: 'Player 2',
                    socketID: '',
                    pick: '',
                };
                socket.to(roomID).emit('server:gameLog/cleared');
                roomHashTable[roomID].gameLog = [];
            } else {
                delete roomHashTable[roomID];
            }
            console.log(roomHashTable);
        });
        if (roomHashTable[roomID]) {
            // if this is defined
            // the room has a player
            // hence it is now full
            // to sender
            socket.emit('server:room/roomJoined', {
                roomID: roomID,
                board: roomHashTable[roomID].board,
                roomFull: true,
                player: 2,
            });
            // to player 1
            socket.to(roomID).emit('server:room/roomJoined', {
                roomFull: true,
            });
            roomHashTable[roomID].roomFull = true;
            roomHashTable[roomID].players[2].socketID = socket.id;
        } else {
            // roomData EXAMPLE:
            // {xCf6: {board: boards[2], roomFull: false, picks: {1: 😎, 2: 😎},
            //   gameLog[ {username: 'player1', message: 'is it an animal?'}, {username: 'player2', message:'Yes.'}, ...] }}
            const roomData = {
                [roomID]: {
                    board: board,
                    roomFull: false,
                    players: [
                        {},
                        { username: 'Player 1', socketID: socket.id, pick: '' },
                        { username: 'Player 2', socketID: '', pick: '' },
                    ],
                    gameLog: [],
                    game: 0,
                },
            };
            // hash table also needs to store choices
            // roomHashTable EXAMPLE:
            // {AdxD5: {board: boards[5], roomFull: true}, bxCf6: {board: boards[2], roomFull: false}}
            roomHashTable = { ...roomHashTable, ...roomData };
            socket.emit('server:room/roomJoined', {
                roomID: roomID,
                board: board,
                roomFull: false,
                player: 1,
            });
            console.log('roomHashTable', roomHashTable);
        }

        socket.on('client:gameLog/turnSubmitted', (turnData) => {
            if (!validateObject(turnData, utils.TURNDATA_TYPES)) {
                return;
            }
            const { player, message } = turnData;
            const roomEntry = roomHashTable[roomID];
            const { board, players } = roomEntry;
            // players is an array of objects
            const { username } = players[player];
            const newTurnData = { username: username, message: message };
            socket.to(roomID).emit('server:gameLog/turnSubmitted', newTurnData);
            // notice if we use pure immutability,
            // i'd have to make a new roomEntry AND a new hashtable!
            roomEntry.gameLog = [
                {
                    time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                    ...newTurnData,
                },
                ...roomEntry.gameLog,
            ];
            const opponent = (player % 2) + 1;
            const { pick: opponentPick } = players[opponent];
            // gameLog is done being modified
            const gameLog = roomEntry.gameLog;
            const playerWin = opponentPick === message;
            const gameOver =
                playerWin || gameLog.length >= utils.GAMELOG_MAX_LENGTH;
            if (gameOver) {
                // now that I've created a new object,
                // all previous variables are stale
                roomHashTable[roomID] = {
                    ...roomEntry,
                    game: roomEntry.game + 1,
                };
                // playerWin was defined from previous state (not stale)
                // player is defined from turnData (not stale)
                const winner = playerWin ? player : 0;
                // stale:
                //const gameID = players[1].socketID +
                //players[2].socketID +
                //game;

                // you can wrap anonymous functions in parenthesis and
                // call them with arguments
                const record = (({ board, players, gameLog, game }) => ({
                    // unique game id is [player1 socketid][player2 socketid][game count]
                    _id: players[1].socketID + players[2].socketID + game,
                    roomID: roomID,
                    winner: winner,
                    board,
                    players,
                    gameLog,
                    game,
                }))(roomHashTable[roomID]);
                /* const record = {
                    _id: gameID,
                    roomID: roomID,
                    winner: winner,
                    board: board,
                    players: players,
                    gameLog: gameLog,
                    game: game,
                    };
                */
                //insertRecordIntoCollection(record, "games");
                // if it is gameOver, log game
                io.in(roomID).emit('server:room/roomJoined', {
                    winner: winner,
                });
                io.in(roomID).emit(
                    'server:gameLog/turnSubmitted',
                    playerWin
                        ? {
                              username: 'guesstimoji',
                              message: `${username} WINS!!!`,
                          }
                        : {
                              username: 'guesstimoji',
                              message: 'Max turns reached. Game ended in draw.',
                          }
                );
            }
            console.log(roomHashTable);
        });
        socket.on('client:players/picked', (pickData) => {
            if (!validateObject(pickData, utils.PICKDATA_TYPES)) {
                return;
            }
            const { pick, player } = pickData;
            // {roomID: players: [{username: , pick: }, {username: ,pick:}]}
            roomHashTable[roomID].players[player].pick = pick;
            if (roomHashTable[roomID].players[1].pick && roomHashTable[roomID].players[2].pick) {
                io.in(roomID).emit('server:room/allPlayersBecameReady', {});
            }
            console.log(roomHashTable[roomID].players[player]);
        });
        socket.on('client:players/reset', (resetData) => {
            console.log('Trying to reset', resetData);
            if (!validateObject(resetData, utils.RESETDATA_TYPES)) {
                return;
            }
            // {roomID: players: [{username: , pick: }, {username: ,pick:}]}
            delete roomHashTable[roomID].players[2].pick;
            delete roomHashTable[roomID].players[1].pick;
            socket.to(roomID).emit('server:players/reset', resetData);
        });
        socket.on('client:opponentBoard/clicked', (unflooredIndex) => {
            const index = Math.floor(unflooredIndex);
            if (!validateBoardIndex(index)) {
                return;
            }
            socket.to(roomID).emit('server:opponentBoard/clicked', index);
        });
    });
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

// servers are kind of all-receiving
server.listen(port, () => {
    console.log(`Starting server on port ${port}`);
});
