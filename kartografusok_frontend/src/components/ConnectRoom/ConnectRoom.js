import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import "../../css/ConnectRoom.css";
import { socketApi } from '../../socket/SocketApi';
import { addMapToActualPlayer, initActualPlayer } from '../../state/actualPlayer/actions';
import { getActualPlayer } from '../../state/actualPlayer/selectors';
import { addMapToPlayer, addPlayer } from '../../state/players/actions';
import { joinRoom } from '../../state/room/actions';
import { getState } from '../../state/selector';
import { wsConnect } from '../../state/store';

export default function ConnectRoom() {
    const [code, setCode] = useState("");
    const [user] = useState(authService.getCurrentUser());
    const state = useSelector(getState);
    const actualPlayer = useSelector(getActualPlayer);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(wsConnect());
        dispatch(initActualPlayer(user));
    }, [])

    const handleChange = async (e) => {
        await setCode(e.target.value);
    }

    const [name, setName] = useState("");

    const handleChangeName = async (e) => {
        await setName(e.target.value);
    }

    const joinRoomAck = (obj) => {
        console.log(obj);
        if(obj.status === "error"){
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Nincs ilyen szobakód!";
        }else{
            dispatch(addMapToActualPlayer(JSON.parse(obj.state).map.blocks))
    
            dispatch({
                type: "SET_STATE",
                payload: JSON.parse(obj.state)
            })
    
            dispatch(addPlayer({ ...user, map: JSON.parse(obj.state).map.blocks, isReady: false, gamePoints: 200 }))
    
            navigate("/letrehozas");
        }
    }

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if(!user && name===""){
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Kérlek, adj meg játékosnevet!";
        }else if(code===""){
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Kérlek, add meg a szobakódot";
        }else if(!actualPlayer){
            dispatch(initActualPlayer({name:name}))
            socketApi.joinRoom(code, actualPlayer, joinRoomAck);
        }
        if(user && code!==""){
            socketApi.joinRoom(code, user, joinRoomAck);
        }
    }

    return (
        <div className='ConnectRoom'>
            <div className='Context'>
                {(actualPlayer)?"":<div className='Div1'>
                    <div className='Div4'>Név:</div>
                    <input className='Div5' onChange={(e) => { handleChangeName(e) }}></input>
                </div>}
                {(actualPlayer)?<div className='Div1'>
                    <div className='Div4' style={{fontSize: "7vh"}}>Szia {actualPlayer.name}!</div>
                </div>:""}
                <div className='Div2' id="div2">
                    <div className='Div4'>Szobakód:</div>
                    <input className='Div5' onChange={(e) => { handleChange(e) }}></input>
                </div>
                <div className='Div3'>
                    <Link to="/">Vissza</Link>
                    <Link id="connectButton" onClick={(e) => { handleJoinRoom(e) }}>Csatlakozás</Link>
                </div>

                <div className='ErrorDiv' id="errorDiv"></div>
            </div>
            <button className='CreateButton' onClick={()=>{
                if(!user && name===""){
                    document.getElementById("div2").style.display = "none";
                    document.getElementById("connectButton").style.display = "none";
                    document.getElementById("errorDiv").style.visibility = "visible"
                    document.getElementById("errorDiv").innerText = "Kérlek, adj meg játékosnevet!";
                }
                if(!user && !actualPlayer && name !== ""){
                    dispatch(initActualPlayer({name:name}))
                }
                if(name || user){
                    navigate("/letrehozas");
                }
            }}>Szoba létrehozás</button>
        </div>
    );
}