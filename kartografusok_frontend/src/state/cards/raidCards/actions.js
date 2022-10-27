export const FILL_RAID_CARDS = "FILL_RAID_CARDS"
export const ADD_RAID_CARD = "ADD_RAID_CARD"
export const REMOVE_RAID_CARD = "REMOVE_RAID_CARD"

export const fillRaidCards = (cards) => ({
    type: FILL_RAID_CARDS,
    payload: cards
})

export const addRaidCard = (card) => ({
    type: ADD_RAID_CARD,
    payload: card
})

export const removeRaidCard = (card) => ({
    type: REMOVE_RAID_CARD,
    payload: card
})