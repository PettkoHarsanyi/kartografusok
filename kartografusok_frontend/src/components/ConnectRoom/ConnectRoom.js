import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import "../../css/ConnectRoom.css";
import { socketApi } from '../../socket/SocketApi';
import { initActualPlayer } from '../../state/actualPlayer/actions';
import { addPlayer } from '../../state/players/actions';
import { joinRoom } from '../../state/room/actions';
import { getState } from '../../state/selector';
import { wsConnect } from '../../state/store';

export default function ConnectRoom() {
    const [code, setCode] = useState("");
    const [user] = useState(authService.getCurrentUser());
    const state = useSelector(getState);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(wsConnect());
        dispatch(initActualPlayer(user));
    },[])

    const handleChange = async (e) => {
        await setCode(e.target.value);
    }

    const joinRoomAck = (obj) => {
        console.log(JSON.parse(obj.state));

        dispatch({
            type: "SET_STATE",
            payload: JSON.parse(obj.state)
        })

        dispatch(addPlayer(user))
        
        
        navigate("/letrehozas");
    }

    const handleJoinRoom = (e) => {
        e.preventDefault();
        socketApi.joinRoom(code,user,joinRoomAck);
    }

    return(
        <div className='ConnectRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='Div4'>Szobakód:</div>
                    <input className='Div5' onChange={(e)=>{handleChange(e)}}></input>
                </div>
                <div className='Div6'>
                    <Link to="/">Vissza</Link>
                    <Link onClick={(e)=>{handleJoinRoom(e)}}>Csatlakozás</Link>
                </div>
            </div>
            <Link className='CreateButton' to="/letrehozas">Szoba létrehozás</Link>
        </div>
    );
}