import { useDispatch, useSelector } from "react-redux"
import { getPlayers } from "../../state/players/selectors"
import "../../css/GameEndModal.css"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import { useEffect } from "react";
import { useState } from "react";
import { updateRoom } from "../../state/room/actions";
import { getRoom } from "../../state/room/selectors";
import { removePlayer } from "../../state/players/actions";
import { socketApi } from "../../socket/SocketApi";

export default function GameEndModal({ }) {
    const players = useSelector(getPlayers);
    const actualPlayer = useSelector(getActualPlayer);
    const room = useSelector(getRoom);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [playersResult] = useState(players);

    const clearState = (e, to) => {
        e.preventDefault();
        dispatch({
            type: "CLEAR_STATE"
        });
        navigate(to);
    }

    const [ordered, setOrdered] = useState([]);

    useEffect(() => {
        const orderedArray = playersResult.sort((a, b) => b.gamePoints - a.gamePoints)
        setOrdered(orderedArray);
    }, [room.gameEnded])

    return (
        <div className="GameEndModal" id="gameEndModal">
            <div className="Context">
                <div className="Div1">Játék vége</div>
                <div className="Div2">
                    <div>Eredmények:</div>
                    <div className="ResultsDiv">
                        {ordered && ordered.map((player, index) => {
                            return (
                                <div key={index} className="Player">{index + 1}. {player.name} - {player.gamePoints} pont</div>
                            )
                        })}
                    </div>
                </div>
                <div className="Div3">
                    <button onClick={(e) => {
                        document.getElementById("gameEndModal").style.display = "none";
                    }}>Vissza</button>
                    {(actualPlayer.isGuest ? <Link to="/regisztracio">Regisztráció</Link> : "")}
                    <Link onClick={(e) => {
                        if (players.length > 1 && actualPlayer.id === room.leader.id) {
                            dispatch(updateRoom(players[1]));
                        }
                        dispatch(removePlayer(actualPlayer));
                        socketApi.leaveRoom(room.roomCode, (ack) => {/*console.log(ack)*/ })
                        clearState(e, "/");
                    }}>Kilépés</Link>
                </div>
            </div>
        </div>
    )
}
