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
import { addPlayer } from './players/actions';
import authService from '../auth/auth.service';
import { modifyActualPlayer } from './actualPlayer/actions';

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
  const { type, payload } = action;

  if (action.type === "CLEAR_STATE") {
    return initialState;
  }

  if (action.type === "SET_STATE") {
    return { ...payload, actualPlayer: state.actualPlayer };
  }

  return appReducer(state, action)
}

const logger = createLogger({
  collapsed: true
})

export const wsConnect = () => (dispatch) => {
  socketApi.connect();

  socketApi.onMessageReceived((message) => {
    if (message.emitter !== socketApi.id) {
      dispatch(addMessage(message));
    }
  })

  socketApi.onUserEdited((user)=>{
    const div = authService.getCurrentUser().division

    if(user.id === authService.getCurrentUser().id){
      console.log("Megváltoztatom a te dolgaidat :)");
      authService.refreshAuthenticatedUser(user);
      dispatch(modifyActualPlayer({...user, division: div}));
    }
  })

  socketApi.onPlayerJoined((action) => {
    // console.log(action);
    // console.log(action);
    // dispatch(action)
    // dispatch(addPlayer(action.player))
    // this.socket.emit(
    //   "sync-state",
    //   action.roomId,
    //   state,
    //   true,
    //   ack
    // );
  })

  socketApi.onStateChanged((action) => {
    // console.log(action);
    // dispatch({
    //   type: "SET_STATE",
    //   payload: action.state
    // })
  })

  socketApi.onActionSent((action)=>{
    // console.log(action);
    // console.log({type: action.type + "_LOCAL", payload: action.payload})
    // console.log("PAYLOAD: ");
    // console.log(action.payload)
    dispatch({type: action.type + "_LOCAL", payload: action.payload}); // DISPATCH LOCAL - csak olyan action ami nincs benne a sync.js-ben, 
                                                                      //így azt nem küldi fel rekurzívan
  })
}

export const store = configureStore({ reducer: rootReducer, middleware: [thunk, logger, sync] });