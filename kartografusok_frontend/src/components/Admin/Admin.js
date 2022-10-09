import React, { useEffect, useState } from 'react';
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


export default function Admin() {
    const loadedData = useLoaderData();
    const [activeLink, setActiveLink] = useState("users");
    const [users, setUsers] = useState(loadedData[0]);
    const [maps] = useState(loadedData[1]);
    const [cards] = useState(loadedData[2]);
    const [selectedUser, setSelectedUser] = useState({});

    const [open, setOpen] = React.useState(false);

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleSelect = async (user) => {
        const response = await axios.get(`api/users/${user.id}`,{
            headers: authHeader()
        });

        setSelectedUser(response.data)
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

        const response = await axios.patch(`api/users/${user.id}`, {
            banned: user.banned ? "0" : "1"
        }, {
            headers: authHeader()
        });

        return response
    }

    return (
        <div className='Admin'>

            {selectedUser && 
            <div className='ModalBackground' onClick={(e) => handleClose(e)} style={{ display: open ? "" : "none" }}>
                <div className='Modal'>
                    <div className='ModalHeader'>
                        <div>{selectedUser.name} módosítása</div>
                        <div className='Clickable' onClick={handleClose}>×</div>
                    </div>
                    <div className='ModalContent'>
                        <div className='UserThings'>
                            <div className='ModalItem'>
                                <div>Felhasználónév</div>
                                <input style={{ width: "15vw" }} type="text" defaultValue={selectedUser.userName} />
                            </div>
                            <div className='ModalItem'>
                                <div>Név</div>
                                <input style={{ width: "10vw" }} type="text" defaultValue={selectedUser.name} />
                            </div>
                            <div className='ModalItem'>
                                <div>E-Mail</div>
                                <input style={{ width: "20vw" }} type="text" defaultValue={selectedUser.email} />
                            </div>
                            <div className='ModalItem'>
                                <div>Összes Pont</div>
                                <input style={{ width: "10vw" }} type="text" defaultValue={selectedUser.points} />
                            </div>
                            <div className='ModalItem'>
                                <div>Heti Pont</div>
                                <input style={{ width: "10vw" }} type="text" defaultValue={selectedUser.weekly} />
                            </div>
                            <div className='ModalItem'>
                                <div>Kép</div>
                                <input style={{ width: "20vw" }} type="text" defaultValue={selectedUser.picture} />
                            </div>
                            <div className='ModalItem'>
                                <div>Némítva</div>
                                <input style={{ width: "5vw" }} type="text" defaultValue={selectedUser.muted} />
                            </div>
                            <div className='ModalItem'>
                                <div>Kitiltva</div>
                                <input style={{ width: "5vw" }} type="text" defaultValue={selectedUser.banned} />
                            </div>
                            <div className='ModalItem'>
                                <div>Rang</div>
                                <input style={{ width: "10vw" }} type="text" defaultValue={selectedUser.role} />
                            </div>
                        </div>
                        <div className='UserMatches'>
                            <div>Játékos üzenetei:</div>
                            <div className='Matches'>

                                {selectedUser.games && selectedUser.games.length > 0 && selectedUser.games.map((game) => {
                                    if(game.messages.length>0){
                                    let gameDateTemp = new Date(game.createdAt);
                                    let gameDate = gameDateTemp.toISOString().split("T")[0];
                                    return (<div className='Match' key={game.id}>
                                        <div className='MatchHeader'>{gameDate}</div>

                                        {game.messages.length > 0 && game.messages.map((message) => {
                                            let date = new Date(message.createdAt)
                                            let dateTemp = date.toISOString().split("T")[1];
                                            let hoursAndMinutes = dateTemp.split('.')[0].split(':')[0] + ":" + dateTemp.split('.')[0].split(':')[1];

                                            return (
                                            <div className='MessageBox' key={message.id}>
                                                <div className='Message'>{message.message}</div>
                                                <div className='Time'>{hoursAndMinutes}</div>
                                            </div>)
                                        })}


                                    </div>)}
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='ModalFooter'>
                        <div className='Clickable' onClick={handleClose}>Bezár</div>
                        <div className='Clickable'>Mentés</div>
                    </div>
                </div>
            </div>
            }

            <nav className='SideNavbar' id="navbar">
                <li className={isActive("users") ? "Item Active" : "Item"} onClick={() => { setActive("users"); }}>Felhasználók</li>
                <li className={isActive("maps") ? "Item Active" : "Item"} onClick={() => setActive("maps")}>Pályák</li>
                <li className={isActive("cards") ? "Item Active" : "Item"} onClick={() => setActive("cards")}>Kártyák</li>
                <Link className='Button' to="/">Kilépés</Link>
            </nav>
            <div className='Content'>
                {activeLink === 'users' && (<div className='Users'>
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
                                        <td className='Clickable' onClick={() => {handleSelect(user); handleOpen() }}><img src={edit} alt="editicon" /></td>
                                    </tr>)
                            })}

                        </tbody>
                    </table>
                </div>)}
                {isActive === "maps" && (<div>maps</div>)}
                {isActive === "cards" && (<div>cards</div>)}

            </div>

        </div>
    );
}