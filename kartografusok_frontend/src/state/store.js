// TBA
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger'
import { actualPlayerReducer, actualPlayerReducerInitialState } from './actualPlayer/reducer';
import { cardsReducer, cardsReducerInitialState } from './cards/reducer';
import { mapReducer, mapReducerInitialState } from './map/reducer';
import { messagesInitialState, messagesReducer } from './messages/reducer';
import { playersInitialState, playersReducer } from './players/reducer';
import { roomInitialState, roomReducer } from './room/reducer';
import thunk from "redux-thunk"
import { socketApi } from '../socket/SocketApi';
import { addMessage } from './messages/actions';
import { RootState } from './store';
import { sync } from './sync';

const appReducer = combineReducers({
  cards: cardsReducer,
  map: mapReducer,
  messages: messagesReducer,
  players: playersReducer,
  room: roomReducer,
  actualPlayer: actualPlayerReducer
})

const initialState = {
  cards: cardsReducerInitialState,
  map: mapReducerInitialState,
  messages: messagesInitialState,
  players: playersInitialState,
  room: roomInitialState,
  actualPlayer: actualPlayerReducerInitialState
}

const rootReducer = (state, action) => {
  const {type,payload} = action;

  if (action.type === "CLEAR_STATE") {
    return initialState;
  }

  if (action.type === "SET_STATE"){
    return {...payload, actualPlayer: state.actualPlayer};
  }

  return appReducer(state, action)
}

const logger = createLogger({
  collapsed: true
})

export const wsConnect = () => (dispatch) => {
  socketApi.connect();

  socketApi.onMessageReceived((message)=>{
      if(message.emitter !== socketApi.id){
          dispatch(addMessage(message));
      }
  })
  
  
}

export const store = configureStore({ reducer: rootReducer, middleware: [thunk, logger, sync] });