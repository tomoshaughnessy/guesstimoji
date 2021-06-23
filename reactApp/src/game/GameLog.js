import React, { useEffect, useState } from 'react';
import TurnHandler from './TurnHandler';
import { connect, useDispatch } from 'react-redux';
import { turnSubmitted } from '../redux/gameLogSlice';

const GameLog = ({ socket, roomID, roomFull, gameLog, player, winner, allPlayersReady }) => {
    const opponent = (player % 2) + 1;
    const dispatch = useDispatch();

    const handleSubmitTurn = (untrimmedMessage) => {
        const message = untrimmedMessage.trim();
        socket.emit('client:gameLog/turnSubmitted', {
            player: player,
            message: message,
        });
        dispatch(turnSubmitted({ username: 'You', message: message }));
    };

    const renderGameLog = () => {
        // the second argument of map is optional, takes in the index
        // of the element
        // don't use curly brace tuples that don't have tags!!
        return gameLog.map(({ username: username, message: message }, i) => (
            <div
                className={i === 0 ? 'game-log-last-message' : 'game-log-message'}
                key={i}
            >
                <span>{username + ':'}</span>
                <span>{message}</span>
            </div>
        ));
    };
    return (
        <div>
            <TurnHandler
                socket={socket}
                player={player}
                turn={gameLog.length}
                roomID={roomID}
                roomFull={roomFull}
                handleSubmitTurn={handleSubmitTurn}
                winner={winner}
                allPlayersReady={allPlayersReady}
            />
            <div className="game-log-box">{renderGameLog()}</div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    gameLog: state.gameLog,
});

const mapDispatchToProps = {
    turnSubmitted,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLog);
