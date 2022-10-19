import { FILL_EXPLORE_CARDS } from "./actions";

export const exploreCardsInitialState = [];

export const exploreCardsReducer = (state = exploreCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;

    if (type === FILL_EXPLORE_CARDS) {
        return payload;
    }

    return state;
};