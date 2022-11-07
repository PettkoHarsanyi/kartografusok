export const INIT_DECK = "INIT_DECK"

export const initDeck = (cards) => ({
    type: INIT_DECK,
    payload: cards,
})