import { socketApi } from "../socket/SocketApi";
import { ADD_PLAYER } from "./players/actions";

export const sync = (store) => (next) => (action) => {
  let isSync = false;

  const types = [
    ADD_PLAYER
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
  }

  next(action);

  if (isSync) {
    // let state = {
    //   ...store.getState().game,
    //   board: { ...store.getState().game.board, handChosen: [] },
    // };

    let state = store.getState();

    socketApi.syncAction(store.getState().room.roomId,{type: "GAME_CHANGED", state: state},true)
  }
};
