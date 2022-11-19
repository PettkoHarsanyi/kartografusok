import { socketApi } from "../socket/SocketApi";
import { DRAW_CARD } from "./cards/drawnCards/actions";
import { ADD_MESSAGE } from "./messages/actions";
import { ADD_PLAYER, MODIFY_PLAYER, REMOVE_PLAYER, UNREADY_PLAYERS } from "./players/actions";
import { END_GAME, GAME_FINISHED, GAME_STARTED, UPDATE_ROOM } from "./room/actions";

export const sync = (store) => (next) => (action) => {
  let isSync = false;

  const types = [
    ADD_PLAYER,
    ADD_MESSAGE,
    MODIFY_PLAYER,
    GAME_STARTED,
    UNREADY_PLAYERS,
    REMOVE_PLAYER,
    GAME_FINISHED,
    UPDATE_ROOM,
    END_GAME
  ];

  if (types.includes(action.type)) {

    if (
      store
        .getState()
        .players.some(
          (player) => player.id === store.getState().actualPlayer.id
        )
    ) {
      isSync = true;
    }

    // console.log(store
    //   .getState()
    //   .players.some(
    //     (player) => player.id === store.getState().actualPlayer.id
    //   ))
  }

  next(action);

  if (isSync) {
    // let state = {
    //   ...store.getState().game,
    //   board: { ...store.getState().game.board, handChosen: [] },
    // };

    let state = store.getState();

    // console.log("SYNCING...")

    // socketApi.syncState(store.getState().room.roomCode,state,true)
    socketApi.syncAction(store.getState().room.roomCode, action, true);
  } else {
    // console.log("NOT SYNCING...")
  }


  // console.log(store.getState());
  if(action.type === ADD_PLAYER && store.getState().room.roomCode){
    if(store.getState().players.some((player)=> player.id !== store.getState().actualPlayer.id)){
      console.log("ASD")
      socketApi.syncAction(store.getState().room.roomCode, action, true);
    }
  }
};
