# guesstim😎ji
Multiplayer emoji guessing game made with MERN Stack. [You can view the demo here (may not be playable).](http://www.guesstimoji.com/)

## Instructions
*Setup*
1. Select a board
2. Click play
3. Give the room ID for your friend to join

*Gameplay*
1. Pick an emoji
2. Wait for your friend to ask you a yes/no question about your emoji
3. Answer yes/no
4. Ask your friend a yes/no question about their emoji
5. Click to hide emojis which violate your friend's answer
6. Repeat from step 2

*Winning condition*  
The first player to send the opponent's picked emoji in chat wins

## Technical details

### Front end

State is managed using `react-redux`. The `store` provided by `redux` is made up of the following slices: 

- `roomSlice`
  - handles room ID, whether the room is full, selected board, and the random emoji that shows in the title
- `opponentBoardSlice`
  - handles when opponent hides emojis
- `gameLogSlice`
  - handles game log
- `playersSlice`
  - handles whether player picked their emoji yet

There is a correspondence between action types and server events, i.e.,  
`room/roomJoined`↔`client:room/roomJoined`,`server:room/roomJoined`.

### Back end

The game logic layer runs on a `node.js` instance. Player picks are stored server side. The server groups client sockets into rooms using `socket.io` and emits game events exclusive to that room. Game state is stored in the `roomHashTable` server side.  
The data access layer is managed with `mongoose` and controller layer with `GraphQL`.  When the game ends, data from the `roomHashTable` is stored in a `mongodb` collection called `games` in the `guesstimoji` database. Here is an example document in the `games` collection:
```json
{
	"_id": "LvvuCjDyYUsQEBC5AAAE1MqglVjwr86Z4UK4AAAF1",
	"roomID": "aJjlA",
	"winner": "Player 2",
	"board": ["🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐚","🐞","🐜","🦗","🕷","🦂","🦟","🦠","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🦦"],
	"players": [
		{},
		{
			"username": "Player 1",
			"socketID": "LvvuCjDyYUsQEBC5AAAE",
			"pick": "🐙"
		},
		{
			"username": "Player 2",
			"socketID": "1MqglVjwr86Z4UK4AAAF",
			"pick": "🐍"
		}
	],
	"gameLog": [
		{
			"time": "2020-08-26T03:00:03Z",
			"username": "Player 2",
			"message": "🐙"
		},
		{
			"time": "2020-08-26T02:59:40Z",
			"username": "Player 2",
			"message": "No."
		},
		{
			"time": "2020-08-26T02:59:38Z",
			"username": "Player 1",
			"message": "does it live in water"
		},
		{
			"time": "2020-08-26T02:59:23Z",
			"username": "Player 1",
			"message": "Yes."
		},
		{
			"time": "2020-08-26T02:59:22Z",
			"username": "Player 2",
			"message": "does it have tentacles"
		},
		{
			"time": "2020-08-26T02:58:45Z",
			"username": "Player 2",
			"message": "No."
		},
		{
			"time": "2020-08-26T02:58:14Z",
			"username": "Player 1",
			"message": "is it a bug"
		},
		{
			"time": "2020-08-26T02:57:59Z",
			"username": "Player 1",
			"message": "Yes."
		},
		{
			"time": "2020-08-26T02:57:57Z",
			"username": "Player 2",
			"message": "does it live in water"
		}
	],
	"game": 1
}
```

### Running locally
In the root directory, run `npm install` in both the `client` and `server` directories. The server requires a local instance of `mongodb` running on port 27017. You must have a database named `guesstimoji` with a collection named `games`. In the `client` directory, run:
```shell
npm start
```
in the `server` directory, run:
```shell
node server
```
