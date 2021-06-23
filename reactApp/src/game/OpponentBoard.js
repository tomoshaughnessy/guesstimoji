import React, { useState } from 'react';
import OpponentSquare from './OpponentSquare';
import { connect } from 'react-redux';
const OpponentBoard = ({ socket, board, show }) => {
    //const [freshBoard, setFreshBoard] = useState(easterEgg(props.room));

    // it'll be way easier to have the second player submit the board I think,
    // updating the board the other player has in Game
    //socket.on(`setFreshBoard`, (newFreshBoard) => (setFreshBoard(newFreshBoard)));

    const renderSquare = (i) => {
        return <OpponentSquare index={i} value={show[i] ? board[i] : '█'} />;
    };
    return (
        <div className="board">
            <div className="board-row">
                {renderSquare(28)}
                {renderSquare(29)}
                {renderSquare(30)}
                {renderSquare(31)}
                {renderSquare(32)}
                {renderSquare(33)}
                {renderSquare(34)}
            </div>
            <div className="board-row">
                {renderSquare(21)}
                {renderSquare(22)}
                {renderSquare(23)}
                {renderSquare(24)}
                {renderSquare(25)}
                {renderSquare(26)}
                {renderSquare(27)}
            </div>
            <div className="board-row">
                {renderSquare(14)}
                {renderSquare(15)}
                {renderSquare(16)}
                {renderSquare(17)}
                {renderSquare(18)}
                {renderSquare(19)}
                {renderSquare(20)}
            </div>
            <div className="board-row">
                {renderSquare(7)}
                {renderSquare(8)}
                {renderSquare(9)}
                {renderSquare(10)}
                {renderSquare(11)}
                {renderSquare(12)}
                {renderSquare(13)}
            </div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                {renderSquare(6)}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    show: state.opponentBoard,
});

export default connect(mapStateToProps, null)(OpponentBoard);
