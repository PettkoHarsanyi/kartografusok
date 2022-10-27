import { ADD_EXPLORE_CARD, FILL_EXPLORE_CARDS, REMOVE_EXPLORE_CARD } from "./actions";

export const exploreCardsInitialState = [];

export const exploreCardsReducer = (state = exploreCardsInitialState, action) => {
    const { type, payload } = action;
    const cards = state;

    if (type === FILL_EXPLORE_CARDS) {
        return payload;
    }

    if(type === ADD_EXPLORE_CARD){
        return [...cards, payload];
    }

    if(type === REMOVE_EXPLORE_CARD){
        return cards.filter(card => card.id !== payload.id)
    }

    return state;
};