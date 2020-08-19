import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import socket from "./socketlocal";
import HomePage from "./pages/home/home.page";
import GamePage from "./pages/game/game.page";
import Footer from "./footer";
import "./index.css";
import { connect } from "react-redux";
import { updateGame } from "./redux/actions";
import { topEmojis } from "./emojis";

// handleJoin data should have both id and board selection
const handleJoin = (data) => {
  socket.emit(`joinRoom`, data);
  socket.on(`gameUpdate`, (data) => {
    if (data) {
      // if data is not null and room isn't full
      // then it is now full
      if (data.roomFull == false) {
        updateGame({ ...data, roomFull: true, playing: true });
      } else {
        // socket leave room
        return;
      }
      // if data is null, that means it's a new game
    } else {
      updateGame({
        id: data.id,
        board: topEmojis,
        roomFull: false,
        playing: true,
      });
    }
  });
};

const App = (id, board, roomFull, playing, updateGame) => {
  return (
    <Router>
      <div className="App" align="center">
        <Switch>
          {/*<Route exact path="/" component={HomePage} />*/}
          <Route
            exact
            path="/"
            render={() => (
              // i don't think homepage needs access to store
              // handleJoin will modify store in App
              <HomePage handleJoin={handleJoin} />
            )}
          />
          <Route
            exact
            path="/game"
            render={
              playing
                ? (id, board) => (
                    <GamePage id={id} board={board} player={roomFull ? 2 : 1} />
                  )
                : null
            }
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  id: state.id,
  board: state.board,
  roomFull: state.roomFull,
  playing: state.playing,
});

// actions : {type: TYPE, ...} ARE OBJECTS
// actionCreators : (obj) => {...action, ...obj} RETURN ACTIONS
// mapDispatchToProps will redefine actionCreators as such:
//      actionCreator(e) = dispatch(actionCreator(e))
// dispatch will give the new action to the reducer who can access state
// reducers : (state, action) => state'
const mapDispatchToProps = {
  updateGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
