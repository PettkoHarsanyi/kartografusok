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

export default function GameEndModal({duration,messages}) {
    const players = useSelector(getPlayers);
    const actualPlayer = useSelector(getActualPlayer);
    const room = useSelector(getRoom);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [playersResult,setPlayersResult] = useState(players);

    useEffect(()=>{
        console.log(duration);
        
        if(actualPlayer.isGuest){
            dispatch(modifyLocalPlayer({...actualPlayer, duration: duration}))
        }
    },[])

    useEffect(()=>{
        setPlayersResult(playersResult.map(player=> players.find(_player => player.id === _player.id)??player))
    },[players])

    // AZT KELL, HOGY AMIKOR VÁLTOZIK A PLAYER, AKKOR A VÁLTOZTATOTT JÁTÉKOS ADATOK KERÜLJENEK A MODALBA
    // A KILÉPÉS IS PLAYER VÁLTOZÁS, DE ILYENKOR NE TÖRLŐDJÖN
    // TEHÁT AZ KELL, HOGY VAN EGY PLAYERSRESULT TÖMBÜNK
    // HA A JÁTÉKOS NINCS BENNE: BELERAKJUK
    // HA BENNE VAN, MÓDOSÍTJUK
    // HA KILÉP ÉS BENNE VAN, ÚGYHAGYJA

    useEffect(()=>{
        players.forEach(player => {
            if(playersResult.some((_player,index) => _player.id === player.id)){
                setPlayersResult(playersResult.map(mappedPlayer => mappedPlayer.id === player.id ? player : mappedPlayer))
            }else{
                setPlayersResult([...playersResult,player])
            }
        });
    },[players])

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
    }, [playersResult])

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
