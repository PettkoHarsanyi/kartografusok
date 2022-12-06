import { useDispatch, useSelector } from "react-redux"
import { getPlayers } from "../../state/players/selectors"
import "../../css/GameEndModal.css"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import { useEffect } from "react";
import { useState } from "react";
import { updateRoom } from "../../state/room/actions";
import { getRoom } from "../../state/room/selectors";
import { modifyLocalPlayer, removePlayer } from "../../state/players/actions";
import { socketApi } from "../../socket/SocketApi";

export default function GameEndModal({ duration, messages, players }) {
    // const players = useSelector(getPlayers);
    const actualPlayer = useSelector(getActualPlayer);
    const room = useSelector(getRoom);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [playersResult, setPlayersResult] = useState([]);

    useEffect(() => {
        console.log(duration);

        if (actualPlayer.isGuest) {
            dispatch(modifyLocalPlayer({ ...actualPlayer, duration: duration }))
        }
    }, [])

    // AZT KELL, HOGY AMIKOR VÁLTOZIK A PLAYER, AKKOR A VÁLTOZTATOTT JÁTÉKOS ADATOK KERÜLJENEK A MODALBA
    // A KILÉPÉS IS PLAYER VÁLTOZÁS, DE ILYENKOR NE TÖRLŐDJÖN
    // TEHÁT AZ KELL, HOGY VAN EGY PLAYERSRESULT TÖMBÜNK
    // HA A JÁTÉKOS NINCS BENNE: BELERAKJUK
    // HA BENNE VAN, MÓDOSÍTJUK
    // HA KILÉP ÉS BENNE VAN, ÚGYHAGYJA
    const [ordered, setOrdered] = useState([]);

    useEffect(() => {
        console.log("PLAYERS")
        console.log(players);
        console.log("PLAYERSRESULT")
        console.log(playersResult)

        let newPlayers = playersResult;
        let orderedArray;

        players.forEach(player => {
            playersResult.forEach((_player) => {
                if (_player.id === player.id) {
                    console.log("Módosítom "+player.name+" game pontjait " + player.gamePoints + "-ra")
                    newPlayers = newPlayers.map(mappedPlayer => mappedPlayer.id === player.id ? player : mappedPlayer)
                }

            })

            
            if (newPlayers.length === 0 || !newPlayers.some(_player => _player.id === player.id)) {
                console.log("Hozzáadom " + player.name + "-t")
                newPlayers = [...newPlayers, player]
            }
        });

        orderedArray = newPlayers.sort((a, b) => b.gamePoints - a.gamePoints)
        
        setOrdered(orderedArray);

        setPlayersResult(newPlayers);
    }, [players])

    useEffect(()=>{
        console.log("AZ ORDERED:")
        console.log(ordered);
    },[ordered])

    const clearState = (e, to) => {
        e.preventDefault();
        dispatch({
            type: "CLEAR_STATE"
        });
        navigate(to);
    }


    // useEffect(() => {
    //     const orderedArray = playersResult.sort((a, b) => b.gamePoints - a.gamePoints)
    //     setOrdered(orderedArray);
    // }, [players])

    return (
        <div className="GameEndModal" id="gameEndModal">
            <div className="Context">
                <div className="Div1">Játék vége</div>
                <div className="Div2">
                    <div>Eredmények:</div>
                    <div className="ResultsDiv">
                        {ordered && ordered.map((player, index) => {
                            return (
                                <div key={index} className="Player">{index + 1}. {player.name} - {(player.season0Points ? player.season0Points.points : 0) + (player.season1Points ? player.season1Points.points : 0) + (player.season2Points ? player.season2Points.points : 0) + (player.season3Points ? player.season3Points.points : 0)} pont</div>
                            )
                        })}
                    </div>
                </div>
                <div className="Div3">
                    <button onClick={(e) => {
                        document.getElementById("gameEndModal").style.display = "none";
                    }}>Vissza</button>
                    {(actualPlayer.isGuest ? <Link to="/regisztracio" duration={duration} messages={messages}>Regisztráció</Link> : "")}
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
