import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../css/Game.css";
import "../../css/InputRange.css";
import { getRoom } from "../../state/room/selectors";
import GameModal from "./GameModal";
import { containerClasses } from "@mui/system";
import { modifyPlayer } from "../../state/players/actions";
import { getActualPlayer } from "../../state/actualPlayer/selectors";
import DrawCanvas from "./DrawCanvas";
import { getPlayers } from "../../state/players/selectors";


export default function Game() {


    const handleCloseModal = (e) => {
        if (e.target !== e.currentTarget) return;
        const component = document.getElementById('modal');
        component.style.display = "none";
    }

    const actualPlayer = useSelector(getActualPlayer);
    const players = useSelector(getPlayers);

    useEffect(() => {
        console.log(actualPlayer)
    }, [actualPlayer])

    useEffect(() => {
        console.log(players)
    }, [players])

    return (
        <div className="Game">
            <GameModal closable={false} handleCloseModal={handleCloseModal} >
                <DrawCanvas handleCloseModal={handleCloseModal} />
            </GameModal>

            {/* {players[1] && players[1].fields && players[1].fields[0] &&
                console.log(players[1].fields[0])
                // <img src={players[1].fields[0].data} />
            } */}
        </div>
    )
}