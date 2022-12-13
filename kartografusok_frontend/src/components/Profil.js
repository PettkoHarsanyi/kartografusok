import React, { createRef, useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import authService from '../auth/auth.service';
import "../css/Profil.css";
import bronz from "../assets/bronze.png";
import ezust from "../assets/ezust.png"
import profilpics from "../assets/user_130x130px.png"
import arany from "../assets/arany.png"
import platina from "../assets/platina.png"
import axios from 'axios';
import authHeader from '../auth/auth-header';
import selectPics from "../assets/selectpics.png"
import { Buffer } from 'buffer';
import { socketApi } from '../socket/SocketApi';
import { wsConnect } from '../state/store';
import { useDispatch, useSelector } from 'react-redux';
import { getActualPlayer } from '../state/actualPlayer/selectors';
import { initActualPlayer } from '../state/actualPlayer/actions';


export default function Profil() {
    const [frame, setFrame] = useState();
    const [decoration, setDecoration] = useState({});
    const [user] = useState(authService.getCurrentUser());

    const actualPlayer = useSelector(getActualPlayer);

    const userMatches = useLoaderData();
    const fileInput = createRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!socketApi.isConnected()) {
            dispatch(wsConnect());
        }
        dispatch(initActualPlayer(user));
    }, [])

    useEffect(() => {
        if (user) {
            switch (user.division.id) {
                case 2:
                    setFrame(ezust);
                    setDecoration({ boxShadow: "0 0 3vh 3vh rgba(170, 209, 222, 0.918), inset 0 0 32px 3vh rgba(170, 209, 222, 0.918)" })
                    break;
                case 3:
                    setFrame(arany)
                    setDecoration({ boxShadow: "0 0 6vh 3vh rgba(255, 225, 0, 0.918), inset 0 0 32px 3vh rgba(255, 225, 0, 0.918)" })
                    break;
                case 4:
                    setFrame(platina)
                    setDecoration({ boxShadow: "0 0 12vh 6vh rgba(72, 0, 255, 0.901), inset 0 0 32px 3vh rgba(72, 0, 255, 0.901)" })
                    break;
                default:
                    setFrame(bronz);
                    setDecoration({ boxShadow: "0 0 3vh 2vh rgba(186, 118, 0, 0.852),inset 0 0 32px 3vh rgba(186, 118, 0, 0.852)" })
                    break;
            }
        }
    }, [user])

    const uploadPicture = async (e) => {
        // console.log(e.target.files[0]);
        // console.log(fileInput.current.files[0]);
        if (fileInput.current.files.length > 0) {
            try {
                const response = await axios.post(`api/users/${user.id}/upload`, {
                    "file": e.target.files[0]
                }, {
                    headers: {
                        ...authHeader(),
                        "Content-Type": "multipart/form-data",
                    }
                });
            }catch(error){
                alert(error.response.data.message);
            }
            window.location.reload(false);
        }
    }

    const [editUser, setEditUser] = useState({ id: user.id });

    const submitForm = async (e) => {
        e.preventDefault();


        if (editUser.password === "") {
            delete editUser.password;
        }


        let response;


        response = await axios.patch(`api/users/${user.id}`, editUser, {
            headers: authHeader()
        }).then(response => {
            if (response.status === 200) {
                document.getElementById("submitEditButton").style.backgroundColor = "lime";
                document.getElementById("submitEditButton").innerHTML = "Sikeres ✔";
                document.getElementById("editErrorDiv").innerHTML = "";
                socketApi.editUserInfo(response.data);
            }
        })
            .catch(function (error) {
                // console.log(error);
                const errorMessages = error.response.data.message.join("<br>");
                // console.log(errorMessages)
                document.getElementById("submitEditButton").style.backgroundColor = "red";
                document.getElementById("submitEditButton").innerHTML = "Hiba";
                document.getElementById("editErrorDiv").style.color = "red";
                document.getElementById("editErrorDiv").innerHTML = errorMessages;
            })
    }

    const handleInputChange = (event) => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        setEditUser({
            ...editUser,
            id: user.id,
            [name]: value,
        })
    }

    return (
        <div className='Profil'>
            <div className='EditBg' id='editBg'>
                <div className='Edit'>
                    <form className='EditContext' onSubmit={(e) => submitForm(e)} autoComplete="off">
                        <div>
                            <label>Email cím</label>
                            <input name='email' defaultValue={actualPlayer.email} onChange={(e) => handleInputChange(e)}></input>
                        </div>
                        <div>
                            <label>Felhasználónév</label>
                            <input name="userName" defaultValue={actualPlayer.userName} onChange={(e) => handleInputChange(e)}></input>
                        </div>
                        <div>
                            <label>Játékos név</label>
                            <input name="name" defaultValue={actualPlayer.name} onChange={(e) => handleInputChange(e)}></input>
                        </div>
                        <div>
                            <label>Új jelszó:</label>
                            <input name='password' defaultValue="" type="password" onChange={(e) => handleInputChange(e)}></input>
                        </div>
                        <div id="editErrorDiv">
                        </div>
                        <div className='EditButtons'>
                            <button onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("editBg").style.visibility = "hidden";
                                document.getElementById("submitEditButton").style.backgroundColor = "#b7b7b7";
                                document.getElementById("submitEditButton").innerHTML = "Változtat";
                            }
                            }>Vissza</button>
                            <button id="submitEditButton" type='submit' defaultValue={actualPlayer.email} onChange={(e) => handleInputChange(e)} onMouseLeave={(e) => {
                                document.getElementById("submitEditButton").style.backgroundColor = "#b7b7b7";
                                document.getElementById("submitEditButton").innerHTML = "Változtat";
                            }}>Változtat</button>
                        </div>
                    </form>
                </div>
            </div>
            <Link className='Button' to="/">Vissza</Link>
            <button id='openEdit' onClick={(e) => {
                e.preventDefault();
                document.getElementById("editBg").style.visibility = "visible";
            }}>Szerkesztés</button>
            <div className='Div1'>
                <div className='Div2'>
                    <div className='Pics' onClick={() => document.getElementById("picInput").click()} onMouseOver={() => {
                        document.getElementById("profilPic").style.opacity = 0.5
                        document.getElementById("selectPics").style.opacity = 1
                    }} onMouseLeave={() => {
                        document.getElementById("selectPics").style.opacity = 0
                        document.getElementById("profilPic").style.opacity = 1
                    }}>
                        <div className='PicsBg'></div>
                        <img src={frame} className="ProfileFrame" draggable="false" alt="profilframe" style={decoration} />
                        <img src={`api/users/${user.id}/profileimage`} draggable="false" id="profilPic" className="ProfilePics" alt="profilpics" />
                        <img src={selectPics} draggable="false" className="SelectPics" alt='select' id='selectPics' />
                        <input type="file" id="picInput" name='picture' className='ImgInput' onChange={(e) => uploadPicture(e)} ref={fileInput} />
                    </div>
                    <div className='Name'>{actualPlayer.name}</div>
                    <div className='Name' style={{ fontSize: "3vh" }}>{"(" + actualPlayer.userName + ")"}</div>
                </div>
                <div className='Points'>
                    <div className='Info'>
                        <h1>Összes pont</h1>
                        <div>{actualPlayer.points}</div>
                    </div>
                    <div className='Info'>
                        <h1>Heti pont</h1>
                        <div>{actualPlayer.weekly}</div>
                    </div>
                    <div className='Info'>
                        <h1>Divízió</h1>
                        <div>{`${actualPlayer.division?.name.charAt(0).toUpperCase()}${actualPlayer.division?.name?.slice(1)}`}</div>
                    </div>
                </div>
                <div className='Div4'>
                    <h1>Legutóbbi meccsek:</h1>
                    <div className='Matches'>

                        <table>
                            <thead>
                                <tr className='Header'>
                                    <th>Meccs</th>
                                    <th>Dátum</th>
                                    <th>Hossz</th>
                                    <th>Pont</th>
                                    <th>Helyezés</th>
                                </tr>
                            </thead>

                            <tbody>
                                {userMatches.length > 0 && userMatches.map((match, index) => {
                                    let date = new Date(match.createdAt)
                                    let dateString = date.toISOString().split('T')[0]
                                    return (
                                        <tr key={match.id} className="Match">
                                            <td>{++index}.</td>
                                            <td>{dateString}</td>
                                            <td>{match.duration} perc</td>
                                            <td>{match.results[0].points} pont</td>
                                            <td>{match.results[0].place}.</td>
                                        </tr>)
                                })}

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}