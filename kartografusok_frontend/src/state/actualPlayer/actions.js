export const INIT_PLAYER = "INIT_PLAYER"
export const MODIFY_PLAYER = "MODIFY_PLAYER"
export const MODIFY_ACTUAL_PLAYER = "MODIFY_ACTUAL_PLAYER"
export const ADD_MAP_TO_ACTUAL_PLAYER = "ADD_MAP_TO_ACTUAL_PLAYER"

export const initActualPlayer = (user) => ({
    type: INIT_PLAYER,
    payload: user
})

export const modifyPlayer = (user) => ({
    type: MODIFY_PLAYER,
    payload: user,
})

export const modifyActualPlayer = (user) => ({
    type: MODIFY_ACTUAL_PLAYER,
    payload: user,
})

export const addMapToActualPlayer = (map) => ({
    type: ADD_MAP_TO_ACTUAL_PLAYER,
    payload: map,
})