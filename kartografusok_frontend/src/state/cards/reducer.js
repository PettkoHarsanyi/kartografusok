import { combineReducers } from "@reduxjs/toolkit";
import { decreeCardsInitialState, decreeCardsReducer } from "./decreeCards/reducer";
import { exploreCardsInitialState, exploreCardsReducer } from "./exploreCards/reducer";
import { pointCardsInitialState, pointCardsReducer } from "./pointCards/reducer";
import { raidCardsInitialState, raidCardsReducer } from "./raidCards/reducer";
import { seasonCardsInitialState, seasonCardsReducer } from "./seasonCards/reducer";

export const cardsReducerInitialState = {
    exploreCards: exploreCardsInitialState,
    pointCards: pointCardsInitialState,
    raidCards: raidCardsInitialState,
    seasonCards: seasonCardsInitialState,
    decreeCards: decreeCardsInitialState
}

export const cardsReducer = combineReducers({
    exploreCards: exploreCardsReducer,
    pointCards: pointCardsReducer,
    raidCards: raidCardsReducer,
    seasonCards: seasonCardsReducer,
    decreeCards: decreeCardsReducer
})