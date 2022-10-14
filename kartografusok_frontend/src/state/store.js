// TBA
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger'
import { cardsReducer } from './cards/reducer';
import { mapReducer } from './map/reducer';
import { messagesReducer } from './messages/reducer';
import { playersReducer } from './players/reducer';

const rootReducer = combineReducers({
  cards: cardsReducer,
  map: mapReducer,
  messages: messagesReducer,
  players: playersReducer,
})

const logger = createLogger({
  collapsed: true
})

export default configureStore({reducer: rootReducer, middleware: [logger]});
