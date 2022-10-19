import { FILL_RAID_CARDS } from "./actions";

export const raidCardsInitialState = []

export const raidCardsReducer = (state = raidCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;

    if (type === FILL_RAID_CARDS) {
        return payload;
    }

    return state;
};