export const ADD_PLAYER = "ADD_PLAYER"

export const addPlayer = (user) => ({
    type: ADD_PLAYER,
    payload: user
})