export const INIT_PLAYER = "INIT_PLAYER"

export const initActualPlayer = (user) => ({
    type: INIT_PLAYER,
    payload: user
})