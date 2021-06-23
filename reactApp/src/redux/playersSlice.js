export const playerReducer = (state = false, action) => {
    switch (action.type) {
        case 'player/picked':
            return true;
        case 'player/reset':
            return false;
        default:
            return state;
    }
};

export const playerPicked = () => ({
    type: 'player/picked',
});

export const playerReset = () => ({
    type: 'player/reset',
});
