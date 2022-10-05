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


export default function Admin() {
    const loadedData = useLoaderData();
    const [activeLink, setActiveLink] = useState("users");
    const [users, setUsers] = useState(loadedData[0]);
    const [maps] = useState(loadedData[1]);
    const [cards] = useState(loadedData[2]);

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const setActive = (link) => {
        setActiveLink(link);
    }

    const isActive = (link) => {
        return link === activeLink;
    }

    async function handleMute(user) {
        const response = await axios.patch(`api/users/${user.id}`, {
            muted: user.muted?"0":"1"
        }, {
            headers: authHeader()
        });

        setUsers(users.map(mappedUser => 
            (mappedUser.id === user.id) ? ({ ...mappedUser, muted: !mappedUser.muted }) : (mappedUser) 
        ))
    }

    async function handleBan(user) {
        const response = await axios.patch(`api/users/${user.id}`, {
            banned: user.banned?"0":"1"
        }, {
            headers: authHeader()
        });

        setUsers(users.map(mappedUser => 
            mappedUser.id === user.id ? ({ ...mappedUser, banned: !mappedUser.banned }):(mappedUser) 
        ))
    }

    return (
        <div className='Admin'>
            <nav className='SideNavbar' id="navbar">
                <div>Vissza</div>
                <li className={isActive("users") ? "Item Active" : "Item"} onClick={() => { setActive("users"); }}>Felhasználók</li>
                <li className={isActive("maps") ? "Item Active" : "Item"} onClick={() => setActive("maps")}>Pályák</li>
                <li className={isActive("cards") ? "Item Active" : "Item"} onClick={() => setActive("cards")}>Kártyák</li>
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
                                        <td className='Clickable' onClick={async () => await handleMute(user)}>{user.muted ? "Igen" : "Nem"}</td>
                                        <td className='Clickable' onClick={async () => await handleBan(user)}>{user.banned ? "Igen" : "Nem"}</td>
                                        <td></td>
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