// kind of arbitrary, first tweet character limit
const MESSAGE_MAX_LENGTH = 140;
// socket.ids seem to be 20 characters, don't want overlap
const ROOMID_MAX_LENGTH = 15;
// emojis can have large lengths
const PICK_MAX_LENGTH = 20;
// iPhone keyboard displays 5x8
const BOARD_MAX_LENGTH = 40;
// 4 messages to eliminate at least one emoji on both boards
const GAMELOG_MAX_LENGTH = 4 * BOARD_MAX_LENGTH;
// 65535 max TCP connections on server at once, room is 2 connections
const ROOMHASHTABLE_MAX_ENTRIES = 20000;
// 10 minute time out in milliseconds
const SERVER_TIMEOUT = 600000;
// make sure keys are in alphabetical order
const JOINDATA_TYPES = {
    // it's a BAD idea to send objects in objects over the server
    board: 'object',
    roomID: 'string',
};

const RESTARTDATA_TYPES = {
    // it's a BAD idea to send objects in objects over the server
    board: 'object',
    roomID: 'string',
}

const PICKDATA_TYPES = {
    pick: 'string',
    player: 'number',
};

// we don't need to send anything to reset a game
const RESETDATA_TYPES = {};

const TURNDATA_TYPES = {
    message: 'string',
    player: 'number',
};

const INDEX_TYPE = 'number';

module.exports = {
    MESSAGE_MAX_LENGTH,
    ROOMID_MAX_LENGTH,
    PICK_MAX_LENGTH,
    BOARD_MAX_LENGTH,
    GAMELOG_MAX_LENGTH,
    ROOMHASHTABLE_MAX_ENTRIES,
    SERVER_TIMEOUT,
    JOINDATA_TYPES,
    RESTARTDATA_TYPES,
    PICKDATA_TYPES,
    RESETDATA_TYPES,
    TURNDATA_TYPES,
    INDEX_TYPE,
};
