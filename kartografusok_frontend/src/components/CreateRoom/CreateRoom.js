import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../auth/auth.service';
import axios from 'axios';
import "../../css/CreateRoom.css";
import authHeader from '../../auth/auth-header';

export default function CreateRoom() {
    const [user] = useState(authService.getCurrentUser());
    const [users,setUsers] = useState([user]);
    const [messages,setMessages] = useState([]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input')

        const response = await axios.post(`api/users/${user.id}/message`, {
            message: input.value,
        }, {
            headers: authHeader()
        });

        let message = response.data;

        message.user = user;

        console.log(message);

        await setMessages([...messages, message])

        input.value = ""

        input.focus({focusVisible: true});
    }

    useEffect(()=>{
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    },[messages])

    return (
        <div className='CreateRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='DivTitle'>Csatlakozott játékosok:</div> 
                    <div className='PlayerDiv'>
                        <div className='PictureDiv'></div>
                        <div className='InfoDiv'>Peti<br />Platina</div>
                    </div>
                    <div className='PlayerDiv'>
                        <div className='PictureDiv'></div>
                        <div className='InfoDiv'>Zsofi<br />Arany</div>
                    </div>
                    <div className='PlayerDiv'>
                        <div className='PictureDiv'></div>
                        <div className='InfoDiv'>Ádám<br />Arany</div>
                    </div>
                </div>
                <div className='Div4'>
                    <form className='ChatDiv' onSubmit={(e)=>handleSendMessage(e)} autocomplete="off">
                        <div className='ChatDivContent' id="chat">
                            {messages && messages.length > 0 &&
                                messages.map((message,index)=>{
                                    console.log(index);
                                    return(<div key={message.id} className='Message'><div className='MessagerName'>{message.user.name}</div><div className='MessageText'>{message.message}</div></div>)
                                })
                            }
                        </div>
                        <div className='ChatDivInput'>
                            <input className='ChatInput' id="input" placeholder='Levelezés 😂📯📩✍'/>
                            <button className='ChatButton' type='submit'>Küldés</button>
                        </div>
                    </form>
                    <div className='ServerInfoDiv'>
                        <div className='TextDiv'>
                            <div>Szoba: Peti szobája</div>
                            <div>Pálya nehézsége: könnyű nehéz</div>
                            <div>Csatlakozott játékosok: 3</div>
                            <div>Szobakód:</div>
                            <div className='InviteDiv'>
                                <input className='CodeDiv' defaultValue={"412kj-412mk-124m-l124m-1k-2l14"} />
                                <button className='CopyButton'>Kimásolás</button>
                            </div>
                        </div>
                        <div className='ButtonDiv'>
                            <Link to="/">Kilépés</Link>
                            <button>Indítás</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}