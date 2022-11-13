import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import authService from '../../auth/auth.service';
import axios from 'axios';
import "../../css/CreateRoom.css";
import authHeader from '../../auth/auth-header';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, sendMessage } from '../../state/messages/actions';
import { getMessages } from '../../state/messages/selectors';
import { addMapToPlayer, addPlayer, modifyPlayer, mutePlayer, removePlayer } from '../../state/players/actions';
import { getPlayers } from '../../state/players/selectors';
import { fillExploreCards } from '../../state/cards/exploreCards/actions';
import { fillRaidCards } from '../../state/cards/raidCards/actions';
import guestpic from "../../assets/profileimage.png"
import unmuted from "../../assets/playerunmute.png"
import muted from "../../assets/playermute.png"
import kick from "../../assets/delete.png"
import { initMap } from '../../state/map/actions';
import { addMapToActualPlayer, initActualPlayer } from '../../state/actualPlayer/actions';
import { createRoom, gameStarted, initRoom } from '../../state/room/actions';
import { wsConnect } from '../../state/store';
import { getRoom } from '../../state/room/selectors';
import { getState } from '../../state/selector';
import { socketApi } from '../../socket/SocketApi';
import { getCards } from '../../state/cards/selector';
import { initPointCards } from '../../state/cards/pointCards/actions';
import { initDeck } from '../../state/cards/deck/actions';
import { getMap } from '../../state/map/selectors';

export default function CreateRoom() {
    const [user, setUser] = useState(authService.getCurrentUser() ?? { id: 0, name: "Vendég", userName: "Vendég", muted: false, banned: false, division: { id: 0, name: "Nincs" }, picture: "profileimage.png" });
    // const [users,setUsers] = useState([user]);
    // const [messages, setMessages] = useState([]);
    const loadedData = useLoaderData();
    const navigate = useNavigate();

    const [exploreCards] = useState(loadedData[0]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[1]); // DB-ből jön, mert dinamikus, a többi stateből
    const [maps] = useState(loadedData[2]); // DB-ből jön, mert dinamikus, a többi stateből

    const dispatch = useDispatch()
    const cards = useSelector(getCards);
    const messages = useSelector(getMessages);
    const room = useSelector(getRoom);
    const state = useSelector(getState);
    const players = useSelector(getPlayers);
    const map = useSelector(getMap);

    useEffect(() => {
        let actualUser = players.find(finduser => finduser.id === user.id)
        if (actualUser) {
            setUser(players.find(finduser => finduser.id === user.id))
        }
    }, [players])

    const getRandomMap = () => {
        return maps[Math.floor(Math.random() * maps.length)]
    }

    const createRoomAck = (obj) => {
        dispatch(initRoom(user, obj.roomId))
    }

    const syncStateAck = (obj) => {
        // console.log(obj);
    }

    const syncActionAck = (obj) => {
        // console.log(obj);
    }

    const randomize4PointCards = () => {
        // console.log(cards.pointCards);
        const shuffled = cards.pointCards.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 4);
        dispatch(initPointCards(selected));
    }

    const randomizeExploreCards = () => {
        const shuffledRaidCards = cards.raidCards.sort(() => 0.5 - Math.random());
        let selectedRaidCards = shuffledRaidCards.slice(0, 4);
        const merged = cards.exploreCards.concat(selectedRaidCards)
        console.log(merged);
        const shuffledMerged = merged.sort(() => 0.5 - Math.random());
        console.log(shuffledMerged);
        dispatch(initDeck(shuffledMerged));
        // const shuffled = cards.exploreCards.
    }

    useEffect(() => {
        if (players.length === 0) {               // CSAK ANNÁL FUT LE, AKI CSINÁLJA A SZOBÁT
            const randomMap = getRandomMap();
            dispatch(initMap(randomMap));
            dispatch(initActualPlayer({...user,isReady: false}));
            dispatch(addMapToActualPlayer(randomMap.blocks));
            dispatch(addPlayer({...user,map:randomMap.blocks,isReady: false}))
            // console.log("Ive been called");
            dispatch(fillExploreCards(exploreCards));
            dispatch(fillRaidCards(raidCards));
            randomize4PointCards();
            // randomizeExploreCards();
        }
    }, [])

    useEffect(() => {
        if (players.length === 1) {               // CSAK ANNÁL FUT LE, AKI CSINÁLJA A SZOBÁT
            console.log("cards have changed");          // ITT AZÉRT PLAYERS.LENGTH === 1, MERT ITT MÁR A LEADER BENT VAN, []-nál még nincs
            randomizeExploreCards();
        }

    }, [cards.exploreCards, cards.raidCards])

    useEffect(() => {
        if (players.length === 1) {
            if (!room.roomCode) {
                // console.log("ITT LEFUTOTTAM, MEGCSINÁLTAM A SZOBÁT");
                dispatch(wsConnect())
                socketApi.createRoom(user, createRoomAck);
            }
            else {
                console.log("ITT NEM FUTOTTAM LE, CSAK CSATLAKOZTAM A SZOBÁHOZ")
            }
        }
        // if(players.length===0){
        //     dispatch(initMap(getRandomMap()))
        //     dispatch(fillExploreCards(exploreCards));
        //     dispatch(fillRaidCards(raidCards));
        //     dispatch(wsConnect())
        //     socketApi.createRoom(user,createRoomAck);
        // }
        // // if(players.length>1){
        // //     socketApi.syncAction(room.roomCode,{type:"ADD_PLAYER",payload:user},true,syncActionAck)
        // // }
        // console.log(players);
        if (room?.roomCode) socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
    }, [players])

    useEffect(() => {
        if (players.length === 1) {
            if (room.leader.id === user.id) {
                // console.log("FELKÜLDTEM A SZOBÁT")
                socketApi.syncState(room.roomCode, state, true, (ack) => {/*console.log(ack)*/ })
            } else {
                // console.log("NEM KÜLDTEM MÁR FEL SEMMIT, A LEADER FELKÜLDTE A SYNCET, LEGKÖZELEBB CSAK ADD PLAYERNÉL KELL")
            }
        }
        // if(room.roomCode && players.length === 0){              // AMIKOR A SZOBA LÉTREHOZÓ VAN CSAK BELÉPVE
        //     socketApi.syncState(room.roomCode,state,true,syncStateAck)  // AMIKOR A SZOBA LÉTREJÖTT ÉS BEÁLLÍTÓDOTT A STATEJA
        // }
    }, [room])

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

            // dispatch(addMessage(message))
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

    useEffect(() => {
        if (room.gameStarted && room.gameStarted === true) {
            // console.log("game has started");
            navigate("/jatek");
        }
    }, [room])

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

    const muteUser = (_user) => {
        dispatch(modifyPlayer({ ..._user, muted: !_user.muted }));
    }

    const kickUser = (_user) => {
        dispatch(removePlayer(_user));
    }

    const handleStartGame = (e) => {
        e.preventDefault();
        dispatch(gameStarted(true));
    }

    return (
        <div className='CreateRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='DivTitle'>Csatlakozott játékosok:</div>
                    <div className='PlayersDiv'>
                        {players && players.length > 0 && players.map((_user) => {
                            return (
                                <div key={_user.id} className='PlayerDiv'>
                                    <div className='MuteBanDiv'>
                                        {_user.id !== user.id && room?.leader.id === user.id && <>
                                            <img onClick={() => muteUser(_user)} src={_user.muted ? muted : unmuted} draggable="false" />
                                            <img onClick={() => kickUser(_user)} src={kick} draggable="false" />
                                        </>}
                                    </div>
                                    <div className='PicsDiv'>
                                        <img src={_user.id === 0 ? guestpic : `api/users/${_user.id}/profileimage`} style={getBorderAndBoxShadow(_user.division)} draggable="false" className="PictureDiv" alt="profilpics" />
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
                            <div>Szoba: {room.leader?.name} szobája</div>
                            {/* <div>Pálya nehézsége: könnyű nehéz</div> */}
                            <div>Csatlakozott játékosok: {players.length}</div>
                            <div>Szobakód:</div>
                            <div className='InviteDiv'>
                                <input className='CodeDiv' id="roomId" defaultValue={room.roomCode} readOnly onClick={() => copy(false)} />
                                <button className='CopyButton' id="copyButton" onClick={() => copy(true)} onMouseLeave={copyDefault}>Kimásolás</button>
                            </div>
                        </div>
                        <div className='ButtonDiv'>
                            <Link to="/" onClick={() => dispatch({
                                type: "CLEAR_STATE"
                            })}>Kilépés</Link>
                            <Link onClick={e => handleStartGame(e)} >Indítás</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}