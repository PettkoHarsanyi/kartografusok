import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import authService from '../../auth/auth.service';
import axios from 'axios';
import "../../css/CreateRoom.css";
import authHeader from '../../auth/auth-header';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../state/messages/actions';
import { getMessages } from '../../state/messages/selectors';
import { addPlayer } from '../../state/players/actions';
import { getPlayers } from '../../state/players/selectors';
import { fillExploreCards } from '../../state/cards/exploreCards/actions';
import { fillRaidCards } from '../../state/cards/raidCards/actions';

export default function CreateRoom() {
    const [user] = useState(authService.getCurrentUser());
    // const [users,setUsers] = useState([user]);
    // const [messages, setMessages] = useState([]);
    const loadedData = useLoaderData();

    const [exploreCards] = useState(loadedData[0]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[1]); // DB-ből jön, mert dinamikus, a többi stateből

    useEffect(()=>{
        dispatch(fillExploreCards(exploreCards));
        dispatch(fillRaidCards(raidCards));
    },[])

    const dispatch = useDispatch()
    const users = useSelector(getPlayers);
    const messages = useSelector(getMessages);

    useEffect(() => {
        dispatch(addPlayer(user))
    }, [])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input')

        const response = await axios.post(`api/users/${user.id}/message`, {
            message: input.value,
        }, {
            headers: authHeader()
        });

        let message = response.data;

        message.user = user; // Azért kell, mert a responseban nem tudom populálni a user-t

        dispatch(addMessage(message))

        input.value = ""

        input.focus({ focusVisible: true });
    }

    useEffect(() => {
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    }, [messages])

    return (
        <div className='CreateRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='DivTitle'>Csatlakozott játékosok:</div>
                    {users && users.length > 0 && users.map((user) => {
                        return(<div key={user.id} className='PlayerDiv'>
                            <div className='PictureDiv'></div>
                            <div className='InfoDiv'>{user.name}<br />{user.division.name}</div>
                        </div>)
                    })
                    }
                </div>
                <div className='Div4'>
                    <form className='ChatDiv' onSubmit={(e) => handleSendMessage(e)} autoComplete="off">
                        <div className='ChatDivContent' id="chat">
                            {messages && messages.length > 0 &&
                                messages.map((message, index) => {
                                    return (<div key={message.id} className='Message'><div className='MessagerName'>{message.user.name}</div><div className='MessageText'>{message.message}</div></div>)
                                })
                            }
                        </div>
                        <div className='ChatDivInput'>
                            <input className='ChatInput' id="input" placeholder='Levelezés 😂📯📩✍' />
                            <button className='ChatButton' type='submit'>Küldés</button>
                        </div>
                    </form>
                    <div className='ServerInfoDiv'>
                        <div className='TextDiv'>
                            <div>Szoba: {user.name} szobája</div>
                            <div>Pálya nehézsége: könnyű nehéz</div>
                            <div>Csatlakozott játékosok: 3</div>
                            <div>Szobakód:</div>
                            <div className='InviteDiv'>
                                <input className='CodeDiv' defaultValue={"412kj-412mk-124m-l124m-1k-2l14"} />
                                <button className='CopyButton'>Kimásolás</button>
                            </div>
                        </div>
                        <div className='ButtonDiv'>
                            <Link to="/" onClick={()=>dispatch({
                                type: "CLEAR_STATE"
                            })}>Kilépés</Link>
                            <button>Indítás</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}