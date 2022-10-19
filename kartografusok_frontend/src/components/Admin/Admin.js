import React, { createRef, useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import "../../css/Admin.css";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import authHeader from '../../auth/auth-header';
import muted from "../../assets/muted.png"
import unmuted from "../../assets/unmuted.png"
import banned from "../../assets/banned.png"
import unbanned from "../../assets/unbanned.png"
import edit from "../../assets/edit.png"
import { Backdrop, Box, Fade, makeStyles, Modal } from '@mui/material';
import authService from '../../auth/auth.service';
import { getCards } from '../../state/cards/selector';
import { useDispatch, useSelector } from 'react-redux';
import { fillExploreCards } from '../../state/cards/exploreCards/actions';
import { fillRaidCards } from '../../state/cards/raidCards/actions';


export default function Admin() {
    const loadedData = useLoaderData();
    const [activeLink, setActiveLink] = useState("users");
    const [users, setUsers] = useState(loadedData[0]);
    // const [maps] = useState(loadedData[1]);
    const [selectedUser, setSelectedUser] = useState({});
    const [divisions] = useState(loadedData[1]);
    const fileInput = createRef();
    const user = authService.getCurrentUser();

    
    const [exploreCards] = useState(loadedData[2]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[3]); // DB-ből jön, mert dinamikus, a többi stateből
    const cards = useSelector(getCards);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fillExploreCards(exploreCards));
        dispatch(fillRaidCards(raidCards));
    },[])

    const [open, setOpen] = React.useState(false);

    const handleInputChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if(name === "division"){
            value = {
                id: divisions.filter(division => division.name === target.value)[0].id,
                name: target.value
            }
        }

        setSelectedUser({
            ...selectedUser,
            [name]: value
        })
    }

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleSelect = async (id) => {
        setSelectedUser(users.find(user => user.id === id))
    }

    const handleClose = (e) => {
        if (e.target !== e.currentTarget) return;
        setOpen(false)
    };

    const setActive = (link) => {
        setActiveLink(link);
    }

    const isActive = (link) => {
        return link === activeLink;
    }

    async function handleMute(user) {
        setUsers(users.map(mappedUser =>
            (mappedUser.id === user.id) ? ({ ...mappedUser, muted: !mappedUser.muted }) : (mappedUser)
        ))

        setSelectedUser({ ...selectedUser, muted: !selectedUser.muted })

        const response = await axios.patch(`api/users/${user.id}`, {
            muted: user.muted ? "0" : "1"
        }, {
            headers: authHeader()
        });

        return response
    }

    async function handleBan(user) {
        setUsers(users.map(mappedUser =>
            mappedUser.id === user.id ? ({ ...mappedUser, banned: !mappedUser.banned }) : (mappedUser)
        ))

        setSelectedUser({ ...selectedUser, banned: !selectedUser.banned })

        const response = await axios.patch(`api/users/${user.id}`, {
            banned: user.banned ? "0" : "1"
        }, {
            headers: authHeader()
        });

        return response;
    }

    const handleSubmit = async (event) =>  {
        event.preventDefault();
        handleClose(event);

        await setSelectedUser({...selectedUser,picture: fileInput.current.files.length > 0 ? fileInput.current.files[0].name : ""});

        setUsers(users.map(mappedUser =>
            mappedUser.id === selectedUser.id ? (selectedUser) : (mappedUser)
        ))

        const response2 = await axios.patch(`api/users/${selectedUser.id}`, selectedUser, {
            headers: authHeader()
        });
        
        if(user.id === selectedUser.id){
            authService.refreshAuthenticatedUser(selectedUser);
        }
    }

    return (
        <div className='Admin'>

            {open && selectedUser &&
                <form onSubmit={(e) => {handleSubmit(e);handleClose(e)}} className='ModalBackground' style={{ display: open ? "" : "none" }}>
                        <div className='Modal'>
                            <div className='ModalHeader'>
                                <div>{selectedUser.name} módosítása</div>
                                <div className='Clickable' onClick={handleClose}>×</div>
                            </div>
                            <div className='ModalContent'>
                                <div className='UserThings'>
                                    <div className='ModalItem'>
                                        <div>Felhasználónév</div>
                                        <input name='userName' style={{ width: "15vw" }} type="text" defaultValue={selectedUser.userName} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Név</div>
                                        <input name='name' style={{ width: "10vw" }} type="text" defaultValue={selectedUser.name} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem'>
                                        <div>E-Mail</div>
                                        <input name='email' style={{ width: "20vw" }} type="text" defaultValue={selectedUser.email} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Összes Pont</div>
                                        <input type="number" name='points' style={{ width: "10vw" }} defaultValue={selectedUser.points} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Heti Pont</div>
                                        <input type="number" name='weekly' style={{ width: "10vw" }} defaultValue={selectedUser.weekly} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem' >
                                        <div>Kép</div>
                                        <input type="file" name='picture' style={{ width: "15vw", border:"none" }} ref={fileInput} onChange={(e) => handleInputChange(e)} />
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Némítva</div>
                                        <div className='Clickable' onClick={() => handleMute(selectedUser)}><img className='Icon' src={selectedUser.muted ? muted : unmuted} alt="muteicon" /></div>
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Kitiltva</div>
                                        <div className='Clickable' onClick={() => handleBan(selectedUser)}><img className='Icon' src={selectedUser.banned ? banned : unbanned} alt="banicon" /></div>
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Rang</div>
                                        <div className='CustomSelect'>
                                            <select className='Clickable' name="role" defaultValue={selectedUser.role} onChange={(e) => handleInputChange(e)}>
                                                <option value={selectedUser.role} disabled hidden>{selectedUser.role}</option>
                                                <option value="ADMIN" className='ItemStyle'>ADMIN</option>
                                                <option value="USER" className='ItemStyle'>USER</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='ModalItem'>
                                        <div>Divízió</div>
                                        <div className='CustomSelect'>
                                            <select className='Clickable' name="division" defaultValue={selectedUser.division.name} onChange={(e) => handleInputChange(e)}>
                                                <option value={selectedUser.division.name} disabled hidden>{selectedUser.division.name}</option>
                                                {divisions && divisions.length > 0 &&
                                                    divisions.map((division) => {
                                                        return (<option key={division.id} value={division.name} className='ItemStyle'>{division.name}</option>)
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {open && selectedUser && selectedUser.messages.length > 0 ?
                                    <div className='UserMatches'>
                                        <div>Játékos üzenetei:</div>
                                        <div className='Matches'>

                                            {selectedUser.games && selectedUser.games.length > 0 && selectedUser.games.map((game) => {
                                                if (selectedUser.messages.length > 0) {
                                                    let gameDateTemp = new Date(game.createdAt);
                                                    let gameDate = gameDateTemp.toISOString().split("T")[0];
                                                    return (<div className='Match' key={game.id}>
                                                        <div className='MatchHeader'>{gameDate}</div>

                                                        {game.messages.length > 0 && game.messages.map((message) => {
                                                            if (message.user === selectedUser.id) {
                                                                let date = new Date(message.createdAt)
                                                                let dateTemp = date.toISOString().split("T")[1];
                                                                let hoursAndMinutes = dateTemp.split('.')[0].split(':')[0] + ":" + dateTemp.split('.')[0].split(':')[1];

                                                                return (
                                                                    <div className='MessageBox' key={message.id}>
                                                                        <div className='Message'>{message.message}</div>
                                                                        <div className='Time'>{hoursAndMinutes}</div>
                                                                    </div>)
                                                            }
                                                        })}


                                                    </div>)
                                                }
                                            })}
                                        </div>
                                    </div> : <div className='Nomessages'><h3>A játékosnak nincsenek üzenetei</h3></div>}
                            </div>
                            <div className='ModalFooter'>
                                <div className='Clickable' onClick={handleClose}>Bezár</div>
                                <button type="submit" className='Clickable'>Mentés</button>
                            </div>
                        </div>
                </form>
            }

            <nav className='SideNavbar' id="navbar">
                <li className={isActive("users") ? "Item Active" : "Item"} onClick={() => { setActive("users"); }}>Felhasználók</li>
                <li className={isActive("maps") ? "Item Active" : "Item"} onClick={() => setActive("maps")}>Pályák</li>
                <li className={isActive("cards") ? "Item Active" : "Item"} onClick={() => setActive("cards")}>Kártyák</li>
                <Link className='Button' onClick={()=>{dispatch({type:"CLEAR_STATE"})}} to="/">Kilépés</Link>
            </nav>
            <div className='Content'>
                {isActive("users") && (<div className='Users'>
                    <table>
                        <thead>
                            <tr className='Header'>
                                <th>Felhasználó név</th>
                                <th>Játékos név</th>
                                <th>E-Mail</th>
                                <th>Jogosultság</th>
                                <th>Némítva</th>
                                <th>Kitiltva</th>
                                <th>Szerkesztés</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 && users.map((user) => {
                                return (
                                    <tr key={user.id} className="User">
                                        <td>{user.userName}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email ? user.email : "Nincs megadva"}</td>
                                        <td>{user.role}</td>
                                        <td className='Clickable' onClick={() => handleMute(user)}><img src={user.muted ? muted : unmuted} alt="muteicon" /></td>
                                        <td className='Clickable' onClick={() => handleBan(user)}><img src={user.banned ? banned : unbanned} alt="banicon" /></td>
                                        <td className='Clickable' onClick={() => { handleSelect(user.id); handleOpen() }}><img src={edit} alt="editicon" /></td>
                                    </tr>)
                            })}

                        </tbody>
                    </table>
                </div>)}
                {isActive("maps") && (<div>
                    {/**
                     * A mapok db-ből jönnek, a state-be createRoomkor kerül be egy random a db-ből
                     */}
                </div>)}
                {isActive("cards") && (
                <div className='Cards'>
                    <div className='CardSection'>
                        <div className='CardType'>Felfedezéskártyák:</div>
                        <div className='CardsDiv'>
                            {cards && cards.exploreCards.length>0 && cards.exploreCards.map((card)=>
                            <div key={card.id} className='Card'>{card.name}<br />{card.fieldType1} {card.fieldType2} {card.cardType === "RUIN" ? card.cardType : ""}<br />{card.blocks1}</div>
                            )}
                            <div className='AddCard'><div>+</div></div>
                        </div>
                    </div>
                    <div className='CardSection'>
                        <div className='CardType'>Pontkártyák:</div>
                        <div className='CardsDiv'>
                            {cards && cards.pointCards.length>0 && cards.pointCards.map((card)=>
                            <div key={card.id} className='Card'>{card.name}<br />{card.points}</div>
                            )}
                        </div>
                    </div>
                    <div className='CardSection'>
                        <div className='CardType'>Rajtaütéskártyák:</div>
                        <div className='CardsDiv'>
                            {cards && cards.raidCards.length>0 && cards.raidCards.map((card)=>
                            <div key={card.id} className='Card'>{card.name}<br />{card.blocks1}<br />{card.direction}</div>
                            )}
                            <div className='AddCard'><div>+</div></div>
                        </div>
                    </div>
                    <div className='CardSection'>
                        <div className='CardType'>Évszakkártyák:</div>
                        <div className='CardsDiv'>
                            {cards && cards.seasonCards.length>0 && cards.seasonCards.map((card)=>
                            <div key={card.id} className='Card'>{card.name}<br />{card.duration}</div>
                            )}
                        </div>
                    </div>
                    <div className='CardSection'>
                        <div className='CardType'>Rendeletkártyák:</div>
                        <div className='CardsDiv'>
                            {cards && cards.decreeCards.length>0 && cards.decreeCards.map((card)=>
                            <div key={card.id} className='Card'>{card.name}</div>
                            )}
                        </div>
                    </div>
                </div>)}

            </div>

        </div>
    );
}