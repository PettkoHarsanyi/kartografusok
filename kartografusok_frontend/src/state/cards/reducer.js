import { combineReducers } from "@reduxjs/toolkit";
import { deckInitialState, deckReducer } from "./deck/reducer";
import { decreeCardsInitialState, decreeCardsReducer } from "./decreeCards/reducer";
import { drawnCardsInitialState, drawnCardsReducer } from "./drawnCards/reducer";
import { exploreCardsInitialState, exploreCardsReducer } from "./exploreCards/reducer";
import { pointCardsInitialState, pointCardsReducer } from "./pointCards/reducer";
import { raidCardsInitialState, raidCardsReducer } from "./raidCards/reducer";
import { seasonCardsInitialState, seasonCardsReducer } from "./seasonCards/reducer";
import { _allDrawnCardsInitialState, _allDrawnCardsReducer } from "./_allDrawnCards/recuder";

export const cardsReducerInitialState = {
    exploreCards: exploreCardsInitialState,
    pointCards: pointCardsInitialState,
    raidCards: raidCardsInitialState,
    seasonCards: seasonCardsInitialState,
    decreeCards: decreeCardsInitialState,
    deck: deckInitialState,
    drawnCards: drawnCardsInitialState,
    _allDrawnCards: _allDrawnCardsInitialState,
}

export const cardsReducer = combineReducers({
    exploreCards: exploreCardsReducer,
    pointCards: pointCardsReducer,
    raidCards: raidCardsReducer,
    seasonCards: seasonCardsReducer,
    decreeCards: decreeCardsReducer,
    deck: deckReducer,
    drawnCards: drawnCardsReducer,
    _allDrawnCards: _allDrawnCardsReducer,
})