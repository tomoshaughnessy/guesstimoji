import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import HomePageDiv from './HomePageDiv';
// boards is a map where the key is name
// it returns an object of {data, preview}
import './index.css';

const HomePage = ({ handleJoin, roomID, randomSmiley, socket }) => {
    return (
        <div>
            <h1 align="center">{'GUESSTIM' + randomSmiley + 'JI'}</h1>
            <HomePageDiv
                handleJoin={handleJoin}
                roomID={roomID}
                socket={socket}
            />
        </div>
    );
};

const mapStateToProps = (state) => ({
    randomSmiley: state.room.randomSmiley,
});

export default connect(mapStateToProps)(HomePage);
