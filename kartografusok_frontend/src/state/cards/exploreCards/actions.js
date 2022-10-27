export const FILL_EXPLORE_CARDS = "FILL_EXPLORE_CARDS"
export const ADD_EXPLORE_CARD = "ADD_EXPLORE_CARD"
export const REMOVE_EXPLORE_CARD = "REMOVE_EXPLORE_CARD"

export const fillExploreCards = (cards) => ({
    type: FILL_EXPLORE_CARDS,
    payload: cards
})

export const addExploreCard = (card) => ({
    type: ADD_EXPLORE_CARD,
    payload: card
})

export const removeExploreCard = (card) => ({
    type: REMOVE_EXPLORE_CARD,
    payload: card
})