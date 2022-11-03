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


export default function Game() {


    const handleCloseModal = (e) => {
        if (e.target !== e.currentTarget) return;
        const component = document.getElementById('modal');
        component.style.display = "none";
    }

    const actualPlayer = useSelector(getActualPlayer);

    useEffect(()=>{
        console.log(actualPlayer)
    },[actualPlayer])

    return (
        <div className="Game">
            <GameModal closable={true} handleCloseModal={handleCloseModal} >
                <DrawCanvas handleCloseModal={handleCloseModal}/>
            </GameModal>
            
        </div>
    )
}