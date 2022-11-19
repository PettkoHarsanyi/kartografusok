import React, { createRef, useEffect, useState } from 'react';
import { Link, Outlet, useLoaderData } from 'react-router-dom';
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
import { addExploreCard, fillExploreCards, removeExploreCard } from '../../state/cards/exploreCards/actions';
import { addRaidCard, fillRaidCards, removeRaidCard } from '../../state/cards/raidCards/actions';
import card_png from "../../assets/card.png"
import card_back_png from "../../assets/card_back.png"
import selectPics from "../../assets/selectpics.png"
import scheme from "../../assets/maps/scheme.png"
import gap from "../../assets/maps/gap.png"
import mountain from "../../assets/maps/mountain.png"
import ruin from "../../assets/maps/ruin.png"
import empty from "../../assets/maps/empty.png"
import ruin_transparent from "../../assets/maps/ruin_transparent.png"
import gap_transparent from "../../assets/maps/gap_transparent.png"
import mountain_transparent from "../../assets/maps/mountain_transparent.png"
import deleteIcon from "../../assets/delete.png"
import megegyezo from "../../assets/megegyezo.png"
import ellentetes from "../../assets/ellentetes.png"
import Map from './Map';
import Card from './Card';

export default function Admin() {
    const loadedData = useLoaderData();
    const [activeLink, setActiveLink] = useState("users");
    const [users, setUsers] = useState(loadedData[0]);
    // const [maps] = useState(loadedData[1]);
    const [selectedUser, setSelectedUser] = useState({});
    const [divisions] = useState(loadedData[1]);
    const fileInput = createRef();
    const user = authService.getCurrentUser();
    const [selectedFile, setSelectedFile] = useState(null);

    const [exploreCards] = useState(loadedData[2]); // DB-ből jön, mert dinamikus, a többi stateből
    const [raidCards] = useState(loadedData[3]); // DB-ből jön, mert dinamikus, a többi stateből
    const [maps, setMaps] = useState(loadedData[4]); // DB-ből jön, mert dinamikus, a többi stateből
    const cards = useSelector(getCards);

    const dispatch = useDispatch();

    const emptyMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const [mapTable, setMapTable] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])

    const handleSetMapTable = (map) => {
        setMapTable(map);
    }
    const FieldTypes = {
        Empty: "",
        Ruin: ruin_transparent,
        Mountain: mountain_transparent,
        Gap: gap_transparent,
    }

    const [selectedFieldType, setSelectedFieldType] = useState(FieldTypes.Empty);

    useEffect(() => {
        dispatch(fillExploreCards(exploreCards));
        dispatch(fillRaidCards(raidCards));
    }, [])

    const [open, setOpen] = React.useState(false);
    const [addCardOpen, setAddCardOpen] = React.useState(false);
    const [exploreCardObject, setExploreCardObject] = React.useState({ cardType: "EXPLORE", hunCardType: "Felfedezés", name: "", duration: 1, fieldType1: "VILLAGE", fieldType2: "", blocks1: "", blocks2: "", picture: "customexplore.png" });
    const [raidCardObject, setRaidCardObject] = React.useState({ cardType: "RAID", name: "", hunCardType: "Rajtaütés", fieldType1: "MONSTER", direction: 1, blocks1: "", picture: "customraid.png" });
    const [ruinCardObject, setRuinCardObject] = React.useState({ cardType: "RUIN", name: "", hunCardType: "Rom", picture: "customexplore.png" });

    const handleInputChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (name === "division") {
            value = {
                id: divisions.filter(division => division.name === target.value)[0].id,
                name: target.value
            }
        }

        setSelectedUser({
            ...selectedUser,
            [name]: value,
        })


    }

    const [isBlocks1ValidJSON, setIsBlocks1ValidJSON] = React.useState(false);
    const [isBlocks2ValidJSON, setIsBlocks2ValidJSON] = React.useState(true);
    const [selectedCardType, setSelectedCardType] = React.useState(exploreCardObject.cardType);

    const handleCardAdderInputChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (name === "cardType") {
            // console.log(value);
            setSelectedCardType(value);

            if (value === exploreCardObject.cardType) {
                setExploreCardObject({ ...exploreCardObject, fieldType1: "VILLAGE", fieldType2: "" })
            }
        }

        if (name === "blocks1") {
            try {
                let l = JSON.parse(value);

                if (l && typeof l === "object" && l.some(item => Array.isArray(item))) {
                    setIsBlocks1ValidJSON(true);
                } else {
                    setIsBlocks1ValidJSON(false)
                }
            }
            catch (e) { setIsBlocks1ValidJSON(false) }
        }

        if (name === "blocks2") {
            try {
                let l = JSON.parse(value);

                if (l && typeof l === "object" && l.some(item => Array.isArray(item))) {
                    setIsBlocks2ValidJSON(true);
                } else {
                    setIsBlocks2ValidJSON(false)
                }
            }
            catch (e) { setIsBlocks2ValidJSON(false) }
            if (value === "") {
                setIsBlocks2ValidJSON(true);
            }
        }

        if (name !== "cardType") {
            if (selectedCardType === raidCardObject.cardType) {
                setRaidCardObject({ ...raidCardObject, [name]: value })
            }
            if (selectedCardType === exploreCardObject.cardType) {
                setExploreCardObject({ ...exploreCardObject, [name]: value })
            }
            if (selectedCardType === ruinCardObject.cardType) {
                setRuinCardObject({ ...ruinCardObject, [name]: value })
            }
        }

    }

    const handleOpen = async () => {
        setOpen(true);
    };

    const handleOpenCardAdder = (cardType) => {
        setSelectedCardType(cardType)
        setAddCardOpen(true)
    };

    const handleCloseCardAdder = (e) => {
        if (e.target !== e.currentTarget) return;
        setAddCardOpen(false)
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

        authService.refreshAuthenticatedUser(user);

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

        authService.refreshAuthenticatedUser(user);

        return response;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleClose(event);

        setUsers(users.map(mappedUser =>
            mappedUser.id === selectedUser.id ? (selectedUser) : (mappedUser)
        ))

        await axios.patch(`api/users/${selectedUser.id}`, selectedUser, {
            headers: authHeader()
        });

        if (selectedFile) {
            await axios.post(`api/users/${selectedUser.id}/upload`, {
                "file": selectedFile
            }, {
                headers: {
                    ...authHeader(),
                    "Content-Type": "multipart/form-data",
                }
            });
        }

        if (user.id === selectedUser.id) {
            authService.refreshAuthenticatedUser(selectedUser);
        }
    }

    const cardItemsCorrect = (card) => {
        if (card.name === "") return false;
        if (card.cardType === "EXPLORE" || card.cardType === "RAID") {
            if (card.blocks1 === "") {
                return false;
            } else {
                try {
                    let l = JSON.parse(card.blocks1);

                    if (l && typeof l === "object" && l.some(item => Array.isArray(item))) {
                    } else {
                        return false;
                    }
                }
                catch (e) { return false }
            }
            if (card.blocks2 && card.blocks2.length > 0) {
                try {
                    let l = JSON.parse(card.blocks2);

                    if (l && typeof l === "object" && l.some(item => Array.isArray(item))) {
                    } else {
                        return false
                    }
                }
                catch (e) { return false }
            }
        }
        return true;
    }

    const handleSubmitCard = async (event) => {
        event.preventDefault();

        if (selectedCardType === exploreCardObject.cardType && cardItemsCorrect(exploreCardObject)) {
            handleCloseCardAdder(event)
            const responseCard = await axios.post(`api/cards`, exploreCardObject, {
                headers: authHeader()
            });
            dispatch(addExploreCard(responseCard.data))
        }
        if (selectedCardType === raidCardObject.cardType && cardItemsCorrect(raidCardObject)) {
            handleCloseCardAdder(event)
            const responseCard = await axios.post(`api/cards`, raidCardObject, {
                headers: authHeader()
            });
            dispatch(addRaidCard(responseCard.data))
        }
        if (selectedCardType === ruinCardObject.cardType && cardItemsCorrect(ruinCardObject)) {
            handleCloseCardAdder(event)
            const responseCard = await axios.post(`api/cards`, ruinCardObject, {
                headers: authHeader()
            });
            dispatch(addExploreCard(responseCard.data))
        }

    }

    const handleAddMap = async (event) => {
        event.preventDefault();
        handleClose(event);

        const response = await axios.post(`api/maps/`, {
            "blocks": mapTable,
        }, {
            headers: {
                ...authHeader(),
            }
        }).then(res => {
            const newMap = res.data;
            newMap.blocks = JSON.stringify(newMap.blocks);
            setMaps([...maps, newMap])
        });
    }

    const handleDeleteMap = async (map) => {
        const response = await axios.delete(`api/maps/${map.id}`, {
            headers: {
                ...authHeader(),
            }
        }).then(res => {
            setMaps(maps.filter(_map => _map.id !== map.id))
        });
    }

    const selectFieldType = (e) => {
        const element = e.target;
        document.querySelectorAll('.MapButtonClicked').forEach(elem => elem.setAttribute("class", "MapButton"))
        element.setAttribute("class", "MapButtonClicked")
    }

    const flipCard = (e) => {
        const inner = e.target.parentElement.closest('div.FlipCardInner');
        inner.style = "transform: rotateY(180deg)"
        // e.target.style = "transform: rotateY(180deg)";
    }

    const flipBackCard = (e) => {
        const inner = e.target.parentElement.closest('div.FlipCardInner');
        inner.style = "transform: rotateY(0deg)"
        // e.target.style = "transform: rotateY(180deg)";
    }

    const handleDeleteCard = async (card) => {
        const response = await axios.delete(`api/cards/${card.id}`, {
            headers: {
                ...authHeader(),
            }
        }).then(res => {
            if (card.cardType === "EXPLORE" || card.cardType === "RUIN") {
                dispatch(removeExploreCard(card))
            }
            if (card.cardType === "RAID") {
                dispatch(removeRaidCard(card))
            }
        });
    }

    return (
        <div className='Admin'>

            {open && selectedUser && isActive("users") &&
                <form onSubmit={(e) => { handleSubmit(e); handleClose(e) }} onClick={(e) => { handleClose(e) }} className='ModalBackground' style={{ display: open ? "" : "none" }}>
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
                                    <div className='InputRelativeParent'>
                                        <div className='PicDiv' onClick={() => document.getElementById("picInput").click()}>Kiválaszt 💾</div>
                                        <input type="file" id="picInput" name='picture' ref={fileInput} onChange={(e) => setSelectedFile(e.target.files[0])} className="PicInput" />
                                    </div>
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
                                                    <div className='MatchHeader'>Játék időpontja: {gameDate}</div>

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

            {open && isActive("maps") &&
                <form onSubmit={(e) => { handleAddMap(e) }} className='ModalBackground' onClick={(e) => { handleClose(e) }} style={{ display: open ? "" : "none" }}>
                    <div className='Modal' id='MapModal'>
                        <div className='ModalHeader'>
                            <div>Pálya hozzáadása</div>
                            <div className='Clickable' onClick={(e) => { handleClose(e); handleSetMapTable(emptyMap) }}>×</div>
                        </div>
                        <div className='ModalContent' id="MapModalContent">
                            {/* jatekter bal felső sarka: width:10% height:20.6 %*/}
                            {/* blokk width:7.3% height:5.1% */}
                            <div className='MapEditor'>
                                <img src={scheme} className="MapPic" alt='Map' />
                                <div className='MapTable'>
                                    <div className='MapTableBody'>
                                        {mapTable.map((row, rowindex) =>
                                            <div key={rowindex} className='MapTableRow'>
                                                {row.map((cell, cellindex) =>
                                                    <div key={cellindex} className='MapTableCell' onClick={(e) => {
                                                        let newMapTable = [...mapTable];
                                                        e.target.parentElement.style.backgroundImage = `url('${selectedFieldType}')`;
                                                        newMapTable[rowindex][cellindex] = Object.values(FieldTypes).indexOf(selectedFieldType);
                                                        handleSetMapTable(newMapTable);
                                                    }} style={{ backgroundPosition: "center", backgroundSize: "cover" }}>
                                                        <div className='MapLayer'>
                                                        </div>
                                                    </div>)}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                            <div className='MapButtons'>
                                <img src={empty} onClick={() => setSelectedFieldType(FieldTypes.Empty)} className="MapButton" id={selectedFieldType === FieldTypes.Empty ? "MapButtonClicked" : ""} alt='Map' />
                                <img src={ruin} onClick={() => setSelectedFieldType(FieldTypes.Ruin)} className="MapButton" id={selectedFieldType === FieldTypes.Ruin ? "MapButtonClicked" : ""} alt='Map' />
                                <img src={mountain} onClick={() => setSelectedFieldType(FieldTypes.Mountain)} className="MapButton" id={selectedFieldType === FieldTypes.Mountain ? "MapButtonClicked" : ""} alt='Map' />
                                <img src={gap} onClick={() => setSelectedFieldType(FieldTypes.Gap)} className="MapButton" id={selectedFieldType === FieldTypes.Gap ? "MapButtonClicked" : ""} alt='Map' />
                            </div>

                        </div>
                        <div className='ModalFooter'>
                            <div className='Clickable' onClick={(e) => { handleClose(e); handleSetMapTable(emptyMap) }}>Bezár</div>
                            <button type="submit" className='Clickable'>Hozzáadás</button>
                        </div>
                    </div>
                </form>
            }

            {addCardOpen && isActive("cards") &&
                <form onSubmit={(e) => { handleSubmitCard(e) }} className='ModalBackground' onClick={(e) => handleCloseCardAdder(e)}>
                    <div className='Modal' id='MapModal'>
                        <div className='ModalHeader'>
                            <div>Kártya hozzáadása</div>
                            <div className='Clickable' onClick={(e) => handleCloseCardAdder(e)}>×</div>
                        </div>
                        <div className='ModalContent' id="CardModalContent">
                            <div className='ContentContainer'>
                                <div className='ModalItem'>
                                    <div>Kártya típus</div>
                                    <div className='CustomSelect'>
                                        <select className='Clickable' name="cardType" defaultValue={selectedCardType} onChange={(e) => handleCardAdderInputChange(e)}>
                                            <option value={exploreCardObject.cardType} disabled hidden>{exploreCardObject.hunCardType}</option>
                                            <option value={exploreCardObject.cardType} className='ItemStyle'>{exploreCardObject.hunCardType}</option>
                                            <option value={raidCardObject.cardType} className='ItemStyle'>{raidCardObject.hunCardType}</option>
                                            <option value={ruinCardObject.cardType} className='ItemStyle'>{ruinCardObject.hunCardType}</option>
                                        </select>
                                    </div>
                                </div>


                                {selectedCardType === exploreCardObject.cardType &&
                                    <>
                                        <div className='ModalItem'>
                                            <div>Kártya név</div>
                                            <input name='name' id="cardName" style={{ width: "20vw" }} type="text" onChange={(e) => handleCardAdderInputChange(e)} defaultValue={exploreCardObject.name} />
                                        </div>
                                        <div className='ModalItem'>
                                            <div>Időtartam</div>
                                            <input type="number" name='duration' style={{ width: "10vw" }} defaultValue={exploreCardObject.duration} onChange={(e) => handleCardAdderInputChange(e)} />
                                        </div>

                                        <div className='ModalItem'>
                                            <div>Mező típus</div>
                                            <div className='CustomSelect'>
                                                <select className='Clickable' name="fieldType1" defaultValue="VILLAGE" onChange={(e) => { handleCardAdderInputChange(e); }}>
                                                    <option value="VILLAGE" disabled hidden>Falu</option>
                                                    <option value="VILLAGE" className='ItemStyle'>Falu</option>
                                                    <option value="FOREST" className='ItemStyle'>Erdő</option>
                                                    <option value="WATER" className='ItemStyle'>Víz</option>
                                                    <option value="FARM" className='ItemStyle'>Farm</option>
                                                    <option value="ANY" className='ItemStyle'>Bármilyen</option>
                                                </select>
                                            </div>
                                        </div>
                                        {exploreCardObject.fieldType1 !== "ANY" &&
                                            <div className='ModalItem'>
                                                <div>Második mező típus</div>
                                                <div className='CustomSelect'>
                                                    <select className='Clickable' name="fieldType2" defaultValue="" onChange={(e) => { handleCardAdderInputChange(e); }}>
                                                        <option value="" disabled hidden>Semleges</option>
                                                        {exploreCardObject.fieldType1 !== "VILLAGE" && <option value="VILLAGE" className='ItemStyle'>Falu</option>}
                                                        {exploreCardObject.fieldType1 !== "FOREST" && <option value="FOREST" className='ItemStyle'>Erdő</option>}
                                                        {exploreCardObject.fieldType1 !== "WATER" && <option value="WATER" className='ItemStyle'>Víz</option>}
                                                        {exploreCardObject.fieldType1 !== "FARM" && <option value="FARM" className='ItemStyle'>Farm</option>}
                                                        <option value="" className='ItemStyle'>Semleges</option>
                                                    </select>
                                                </div>
                                            </div>
                                        }
                                        <div className='ModalItem' id='modalTextArea'>
                                            <div>Forma</div>
                                            <textarea defaultValue={exploreCardObject.blocks1} style={{ outlineColor: isBlocks1ValidJSON ? "green" : "red", border: isBlocks1ValidJSON ? "0.3vh solid black" : "0.3vh solid red" }} name="blocks1" rows="4" cols="20" placeholder='Csak JSON helyes tömbök tömbje. Pl: [[0,0],[1,0]] vagy [[0,0,1]]' onChange={(e) => { handleCardAdderInputChange(e) }}>
                                            </textarea>
                                        </div>
                                        {exploreCardObject.fieldType1 !== "ANY" &&

                                            <div className='ModalItem' id='modalTextArea'>
                                                <div>Második forma</div>
                                                <textarea defaultValue={exploreCardObject.blocks2} style={{ outlineColor: isBlocks2ValidJSON ? "green" : "red", border: isBlocks2ValidJSON ? "0.3vh solid black" : "0.3vh solid red" }} name="blocks2" rows="4" cols="20" placeholder='Csak JSON helyes tömbök tömbje, vagy üres' onChange={(e) => { handleCardAdderInputChange(e) }}>
                                                </textarea>
                                            </div>
                                        }
                                    </>
                                }

                                {selectedCardType === raidCardObject.cardType &&
                                    <>
                                        <div className='ModalItem'>
                                            <div>Kártya név</div>
                                            <input name='name' id="cardName" style={{ width: "20vw" }} type="text" onChange={(e) => handleCardAdderInputChange(e)} defaultValue={raidCardObject.name} />
                                        </div>
                                        <div className='ModalItem'>
                                            <div>Csere iránya</div>
                                            <div className='DirectionsDiv'>
                                                <img src={megegyezo} name="direction" onClick={() => { setRaidCardObject({ ...raidCardObject, direction: 1 }) }} alt="Ora iránya" style={{ border: raidCardObject.direction === 1 ? "0.5vh solid blue" : "" }} />
                                                <img src={ellentetes} name="direction" onClick={() => { setRaidCardObject({ ...raidCardObject, direction: -1 }) }} alt="Ora nem iránya" style={{ border: raidCardObject.direction === -1 ? "0.5vh solid blue" : "" }} />
                                            </div>
                                        </div>

                                        <div className='ModalItem' id='modalTextArea'>
                                            <div>Forma</div>
                                            <textarea defaultValue={raidCardObject.blocks2} style={{ outlineColor: isBlocks1ValidJSON ? "green" : "red", border: isBlocks1ValidJSON ? "0.3vh solid black" : "0.3vh solid red" }} name="blocks1" rows="4" cols="20" placeholder='Csak JSON helyes tömbök tömbje. Pl: [[0,0],[1,0]] vagy [[0,0,1]]' onChange={(e) => { handleCardAdderInputChange(e) }}>
                                            </textarea>
                                        </div>
                                    </>
                                }

                                {selectedCardType === ruinCardObject.cardType &&
                                    <>
                                        <div className='ModalItem'>
                                            <div>Kártya név</div>
                                            <input name='name' id="cardName" style={{ width: "20vw" }} type="text" onChange={(e) => handleCardAdderInputChange(e)} defaultValue={ruinCardObject.name} />
                                        </div>
                                    </>
                                }


                            </div>
                        </div>
                        <div className='ModalFooter'>
                            <div className='Clickable' onClick={(e) => handleCloseCardAdder(e)}>Bezár</div>
                            <button type="submit" className='Clickable'>Hozzáadás</button>
                        </div>
                    </div>
                </form>
            }

            <nav className='SideNavbar' id="navbar">
                <li className={isActive("users") ? "Item Active" : "Item"} onClick={() => { setActive("users"); }}>Felhasználók</li>
                <li className={isActive("maps") ? "Item Active" : "Item"} onClick={() => setActive("maps")}>Pályák</li>
                <li className={isActive("cards") ? "Item Active" : "Item"} onClick={() => setActive("cards")}>Kártyák</li>
                <Link className='Button' onClick={() => { dispatch({ type: "CLEAR_STATE" }) }} to="/">Kilépés</Link>
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
                {isActive("maps") && (
                    <div className='Maps'>
                        <div className='MapsTitle'>Pályák:</div>
                        <div className='MapsSection'>
                            {maps && maps.length > 0 &&
                                maps.map((map, index) => {
                                    return (<Map key={index} mapTable={JSON.parse(map.blocks)}
                                        children={
                                            map.official ?
                                                <div className='OfficialMapTableHovered'><div>Hivatalos</div></div>
                                                :
                                                <div className='UserMapTableHovered'><img src={deleteIcon} alt="delete" onClick={() => handleDeleteMap(map)} /></div>
                                        }
                                    />)
                                })
                            }
                            <div className='AddMap' onClick={handleOpen}><div>+</div></div>
                        </div>
                    </div>
                )}

                {/**
                     * A mapok db-ből jönnek, a state-be createRoomkor kerül be egy random a db-ből
                     */}
                {isActive("cards") && (
                    <div className='Cards'>
                        <div className='CardSection'>
                            <div className='CardType'>Felfedezéskártyák:</div>
                            <div className='CardsDiv'>
                                {cards && cards.exploreCards.length > 0 && cards.exploreCards.map((card) =>

                                    <Card key={card.id} card={card} handleDeleteCard={handleDeleteCard} />



                                    // <div key={card.id} className='Card'>{card.name}<br />{card.fieldType1} {card.fieldType2} {card.cardType === "RUIN" ? card.cardType : ""}<br />{card.blocks1}</div>
                                )}
                                <div className='AddCard' onClick={() => handleOpenCardAdder("EXPLORE")}><div>+</div></div>
                            </div>
                        </div>
                        <div className='CardSection'>
                            <div className='CardType'>Pontkártyák:</div>
                            <div className='CardsDiv'>
                                {cards && cards.pointCards.length > 0 && cards.pointCards.map((card) =>
                                    <div key={card.id} className="FlipCard">
                                        <div className="FlipCardInner">
                                            <div className="FlipCardFront">
                                                <img src={require(`../../assets/cards/${card.picture}`)} className="Card" onClick={(e) => flipCard(e)} />
                                            </div>
                                            <div className="FlipCardBack" id="Back">
                                                <div className='CardBack' onClick={(e) => flipBackCard(e)} >
                                                    <img src={require(`../../assets/cards/${card.backPicture}`)} className='CardBackImg' />
                                                    <div className='CardBackText'>
                                                        <div className='Attribute'>{card.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='CardSection'>
                            <div className='CardType'>Rajtaütéskártyák:</div>
                            <div className='CardsDiv'>
                                {cards && cards.raidCards.length > 0 && cards.raidCards.map((card) =>

                                    <Card key={card.id} card={card} handleDeleteCard={handleDeleteCard} />


                                )}
                                <div className='AddCard' onClick={() => handleOpenCardAdder("RAID")}><div>+</div></div>
                            </div>
                        </div>
                        <div className='CardSection'>
                            <div className='CardType'>Évszakkártyák:</div>
                            <div className='CardsDiv'>
                                {cards && cards.seasonCards.length > 0 && cards.seasonCards.map((card) =>
                                    <div key={card.id} className="FlipCard">
                                        <div className="FlipCardInner">
                                            <div className="FlipCardFront">
                                                <img src={require(`../../assets/cards/${card.picture}`)} className="Card" onClick={(e) => flipCard(e)} />
                                            </div>
                                            <div className="FlipCardBack">
                                                <div className='CardBack' onClick={(e) => flipBackCard(e)} >
                                                    <img src={require(`../../assets/cards/${card.backPicture}`)} className="CardBackImg" onClick={(e) => flipBackCard(e)} />
                                                    <div className='CardBackText'>
                                                        <div className='Attribute'>{card.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='CardSection'>
                            <div className='CardType'>Rendeletkártyák:</div>
                            <div className='CardsDiv'>
                                {cards && cards.decreeCards.length > 0 && cards.decreeCards.map((card) =>
                                    <div key={card.id} className="FlipCard">
                                        <div className="FlipCardInner">
                                            <div className="FlipCardFront">
                                                <img src={require(`../../assets/cards/${card.picture}`)} className="Card" onClick={(e) => flipCard(e)} />
                                            </div>
                                            <div className="FlipCardBack">
                                                <img src={require(`../../assets/cards/${card.backPicture}`)} className="CardBack" onClick={(e) => flipBackCard(e)} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>)}

            </div>

        </div>
    );
}