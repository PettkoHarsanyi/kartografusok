import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import axios from 'axios';
import "../../css/CreateRoom.css";
import authHeader from '../../auth/auth-header';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../state/messages/actions';
import { getMessages } from '../../state/messages/selectors';
import { addPlayer, mutePlayer, removePlayer } from '../../state/players/actions';
import { getPlayers } from '../../state/players/selectors';
import { fillExploreCards } from '../../state/cards/exploreCards/actions';
import { fillRaidCards } from '../../state/cards/raidCards/actions';
import guestpic from "../../assets/profileimage.png"
import unmuted from "../../assets/playerunmute.png"
import muted from "../../assets/playermute.png"
import kick from "../../assets/delete.png"

export default function CreateRoom() {
    const [user, setUser] = useState(authService.getCurrentUser() ?? { id: 0, name: "Vendég", userName: "Vendég", muted: false, banned: false, division: { id: 0, name: "Nincs" }, picture: "profileimage.png" });
    // const [users,setUsers] = useState([user]);
    // const [messages, setMessages] = useState([]);
    const loadedData = useLoaderData();
    const navigate = useNavigate();

    const [exploreCards] = useState(loadedData[0]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[1]); // DB-ből jön, mert dinamikus, a többi stateből

    useEffect(() => {
        dispatch(fillExploreCards(exploreCards));
        dispatch(fillRaidCards(raidCards));
    }, [])

    const dispatch = useDispatch()
    const users = useSelector(getPlayers);
    const messages = useSelector(getMessages);

    useEffect(() => {
        let actualUser = users.find(finduser => finduser.id === user.id)
        if (actualUser) {
            setUser(users.find(finduser => finduser.id === user.id))
        }
    }, [users])

    useEffect(() => {
        dispatch(addPlayer(user))
        dispatch(addPlayer({
            id: 3,
            name: 'Adam',
            userName: 'adam',
            role: 'USER',
            division: {
                id: 3,
                name: 'Arany',
                createdAt: '2022-10-08T17:22:22.470Z',
                modifiedAt: '2022-10-08T17:22:22.470Z'
            },
            banned: false,
            muted: false,
            points: 2500,
            weekly: 2200
        }))
    }, [])

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = document.getElementById('input')

        if (input.value !== "") {
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

    }

    const getBorderAndBoxShadow = (division) => {
        switch (division.id) {
            case 4:
                return {
                    boxShadow: "0 0 6vh 1vh rgba(72, 0, 255, 0.901), inset 0 0 32px 3vh rgba(72, 0, 255, 0.901)",
                    zIndex: 4
                }
            case 3:
                return {
                    boxShadow: "0 0 6vh 1vh rgba(255, 225, 0, 0.918), inset 0 0 32px 3vh rgba(255, 225, 0, 0.918)",
                    zIndex: 3
                }
            case 2:
                return {
                    boxShadow: "0 0 3vh 1vh rgba(170, 209, 222, 0.918), inset 0 0 32px 3vh rgba(170, 209, 222, 0.918)",
                    zIndex: 2
                }
            case 1:
                return {
                    boxShadow: "0 0 3vh 1vh rgba(186, 118, 0, 0.852),inset 0 0 32px 3vh rgba(186, 118, 0, 0.852)",
                    zIndex: 1
                }
            default:
                return {
                    boxShadow: "none",
                    zIndex: 1
                }
        }
    }

    useEffect(() => {
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    }, [messages])

    const copy = (b) => {
        var copyText = document.getElementById("roomId");
        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");

        if (b) {
            document.getElementById("copyButton").innerHTML = "Másolva ✔";
            document.getElementById("copyButton").setAttribute("class", "Copied")
        }
    }

    const copyDefault = () => {
        document.getElementById("copyButton").innerHTML = "Kimásolás";
        document.getElementById("copyButton").setAttribute("class", "CopyButton")
    }

    const muteUser = (user) => {
        dispatch(mutePlayer(user));
    }

    const kickUser = (user) => {
        dispatch(removePlayer(user));
    }

    return (
        <div className='CreateRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='DivTitle'>Csatlakozott játékosok:</div>
                    <div className='PlayersDiv'>
                        {users && users.length > 0 && users.map((_user) => {
                            return (
                                <div key={_user.id} className='PlayerDiv'>
                                    <div className='MuteBanDiv'>
                                        {_user.id !== user.id && <>
                                            <img onClick={() => muteUser(_user)} src={_user.muted ? muted : unmuted} />
                                            <img onClick={() => kickUser(_user)} src={kick} />
                                        </>}
                                    </div>
                                    <div className='PicsDiv'>
                                        <img src={_user.id === 0 ? guestpic : `api/users/${_user.id}/profileimage`} style={getBorderAndBoxShadow(_user.division)} className="PictureDiv" alt="profilpics" />
                                    </div>
                                    <div className='InfoDiv'>{_user.name}<br />{_user.division.name}</div>
                                </div>)
                        })
                        }
                    </div>
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
                            <input disabled={user.muted} style={{ cursor: user.muted ? "not-allowed" : "text" }} className='ChatInput' id="input" placeholder={user.muted ? 'Némítva vagy🤐' : 'Levelezés 😂📯📩✍'} />
                            <button disabled={user.muted} style={{ cursor: user.muted ? "not-allowed" : "pointer" }} className='ChatButton' type='submit'>{user.muted ? '🚫' : "Küldés"}</button>
                        </div>
                    </form>
                    <div className='ServerInfoDiv'>
                        <div className='TextDiv'>
                            <div>Szoba: {user.name} szobája</div>
                            {/* <div>Pálya nehézsége: könnyű nehéz</div> */}
                            <div>Csatlakozott játékosok: 3</div>
                            <div>Szobakód:</div>
                            <div className='InviteDiv'>
                                <input className='CodeDiv' id="roomId" defaultValue={"412kj-412mk-124m-l124m-1k-2l14"} readOnly onClick={() => copy(false)} />
                                <button className='CopyButton' id="copyButton" onClick={() => copy(true)} onMouseLeave={copyDefault}>Kimásolás</button>
                            </div>
                        </div>
                        <div className='ButtonDiv'>
                            <Link to="/" onClick={() => dispatch({
                                type: "CLEAR_STATE"
                            })}>Kilépés</Link>
                            <Link to="/jatek">Indítás</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}