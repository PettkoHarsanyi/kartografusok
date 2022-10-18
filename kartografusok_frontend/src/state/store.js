// TBA
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger'
import { cardsReducer, cardsReducerInitialState } from './cards/reducer';
import { mapReducer, mapReducerInitialState } from './map/reducer';
import { messagesInitialState, messagesReducer } from './messages/reducer';
import { playersInitialState, playersReducer } from './players/reducer';

const appReducer = combineReducers({
  cards: cardsReducer,
  map: mapReducer,
  messages: messagesReducer,
  players: playersReducer,
})

const initialState = {
  cards: cardsReducerInitialState,
  map: mapReducerInitialState,
  messages: messagesInitialState,
  players: playersInitialState,
}

const rootReducer = (state, action) => {
  if (action.type === "CLEAR_STATE") {
    return initialState;
  }

  return appReducer(state, action)
}

const logger = createLogger({
  collapsed: true
})

export default configureStore({ reducer: rootReducer, middleware: [logger] });
