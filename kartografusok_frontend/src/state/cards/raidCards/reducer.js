import { ADD_RAID_CARD, FILL_RAID_CARDS, REMOVE_RAID_CARD } from "./actions";

export const raidCardsInitialState = []

export const raidCardsReducer = (state = raidCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;

    if (type === FILL_RAID_CARDS) {
        return payload;
    }

    if(type === ADD_RAID_CARD){
        return [...cards, payload]
    }

    if(type === REMOVE_RAID_CARD){
        return cards.filter(card => card.id !== payload.id)
    }

    return state;
};