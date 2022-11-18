import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import "../../css/ConnectRoom.css";
import { socketApi } from '../../socket/SocketApi';
import { addMapToActualPlayer, initActualPlayer, modifyActualPlayer } from '../../state/actualPlayer/actions';
import { getActualPlayer } from '../../state/actualPlayer/selectors';
import { addMapToPlayer, addPlayer } from '../../state/players/actions';
import { joinRoom } from '../../state/room/actions';
import { getState } from '../../state/selector';
import { wsConnect } from '../../state/store';

export default function ConnectRoom() {
    const [code, setCode] = useState("");
    const [user, setUser] = useState(authService.getCurrentUser());
    const state = useSelector(getState);
    const actualPlayer = useSelector(getActualPlayer);
    const navigate = useNavigate();
    const [id, setId] = useState()
    const [name, setName] = useState("");
    const [guest,setGuest] = useState({ name: name, userName: "Vendég", id: -Math.floor(((Math.random() * 201) + 100)), isGuest: true, gamePoints: 0, isReady: false, muted: false, banned: false, division: { id: 0, name: "Vendég" }, picture: "profileimage.png" })

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(wsConnect());
        dispatch(initActualPlayer(user));
    }, [])

    const handleChange = async (e) => {
        await setCode(e.target.value);
    }


    const handleChangeName = async (e) => {
        await setGuest({...guest, name: e.target.value})
        await setName(e.target.value);
    }

    const joinRoomAck = (obj) => {
        console.log(obj);
        if (obj.status === "error") {
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Nincs ilyen szobakód!";
        } else {
            // dispatch(addMapToActualPlayer(JSON.parse(obj.state).map.blocks))
            console.log(actualPlayer);
            let playerToBeAdded = { ...actualPlayer };
            if (user) {   // NEM VENDÉGNÉL MÉG BE KELL ÁLLÍTANI
                dispatch(modifyActualPlayer({ ...actualPlayer, map: JSON.parse(obj.state).map.blocks, isReady: false, gamePoints: 0 }))
                playerToBeAdded = { ...playerToBeAdded, map: JSON.parse(obj.state).map.blocks, isReady: false, gamePoints: 0 }
            } else {      // VENDÉGNÉL MÁR BE VAN
                dispatch(modifyActualPlayer({ ...guest, map: JSON.parse(obj.state).map.blocks }))
                playerToBeAdded = { ...guest, map: JSON.parse(obj.state).map.blocks }
            }

            dispatch({
                type: "SET_STATE",
                payload: JSON.parse(obj.state)
            })

            dispatch(addPlayer(playerToBeAdded))

            navigate("/letrehozas");
        }
    }

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (!user && name === "") {
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Kérlek, adj meg játékosnevet!";
        } else if (code === "") {
            document.getElementById("errorDiv").style.visibility = "visible"
            document.getElementById("errorDiv").innerText = "Kérlek, add meg a szobakódot";
        } else {
            if (!user) {
                dispatch(initActualPlayer(guest))
                socketApi.joinRoom(code, guest, joinRoomAck);
            }
            if (user && code !== "") {
                socketApi.joinRoom(code, user, joinRoomAck);
            }
        }

    }

    return (
        <div className='ConnectRoom'>
            <div className='Context'>
                {(actualPlayer) ? "" : <div className='Div1'>
                    <div className='Div4'>Név:</div>
                    <input className='Div5' onChange={(e) => { handleChangeName(e) }}></input>
                </div>}
                {(actualPlayer) ? <div className='Div1'>
                    <div className='Div4' style={{ fontSize: "7vh" }}>Szia {actualPlayer.name}!</div>
                </div> : ""}
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
            <button className='CreateButton' onClick={() => {
                if (!user && name === "") {
                    document.getElementById("div2").style.display = "none";
                    document.getElementById("connectButton").style.display = "none";
                    document.getElementById("errorDiv").style.visibility = "visible"
                    document.getElementById("errorDiv").innerText = "Kérlek, adj meg játékosnevet!";
                }
                if (!user && !actualPlayer && name !== "") {
                    dispatch(initActualPlayer({ ...actualPlayer, id: Math.floor(((Math.random() * 201) + 100)), name: name, isReady: false, gamePoints: 0, userName: "Vendég", muted: false, banned: false, division: { id: 0, name: "Vendég" }, picture: "profileimage.png", isGuest: true }))
                }
                if (name || user) {
                    navigate("/letrehozas");
                }
            }}>Szoba létrehozás</button>
        </div>
    );
}