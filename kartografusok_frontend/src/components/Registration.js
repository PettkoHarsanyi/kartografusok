import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../auth/auth.service';
import "../css/Registration.css";
import { getActualPlayer } from '../state/actualPlayer/selectors';
import axios from 'axios';
import authHeader from '../auth/auth-header';
import { getPlayers } from '../state/players/selectors';
import { getMessages } from '../state/messages/selectors';

export default function Registration({ duration }) {
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [singleError, setSingleError] = useState("");
    const [userName, setUserName] = useState("");
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const actualPlayer = useSelector(getActualPlayer);
    const [name, setName] = useState(actualPlayer?.name ?? "");
    const players = useSelector(getPlayers);
    const messages = useSelector(getMessages);

    const postGame = async (duration, results, users, messages) => {
        const gameResponse = await axios.post(`api/games`, { duration: duration, results, users, messages }, {
            headers: authHeader()
        });
        return gameResponse;
    }

    const postResult = async (user, points, place) => {
        const resultResponse = await axios.post(`api/users/${user.id}/result`, { user: user.id, points, place }, {
            headers: authHeader()
        });
        return resultResponse;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (actualPlayer?.gamePoints) {
                await AuthService.signUp(name, userName, password, actualPlayer.gamePoints).then(
                    async (answ) => {
                        // console.log(answ);



                        const place = (players.sort((a, b) => b.gamePoints - a.gamePoints)).findIndex(player => {
                            return player.id === actualPlayer.id
                        }) + 1;


                        // Akkor kap gameresultot ha nem ő volt a szoba vezető
                        if (actualPlayer.gameResult) {
                            // console.log(actualPlayer.gameResult);

                            const resultResponse = await axios.post(`api/users/${answ.id}/resultaftergame`, { user: answ.id, points: actualPlayer.gamePoints, place: place, game: actualPlayer.gameResult }, {
                                headers: authHeader()
                            });

                            const connectResponse = await axios.patch(`api/users/${answ.id}/connectgame`, actualPlayer.gameResult, {
                                headers: authHeader()
                            })

                        } else {  // ha ő volt akkor a results az a 
                            const users = [answ];

                            let results = [];
                            results.push(postResult(answ, actualPlayer.gamePoints, place))

                            Promise.all(results).then(
                                async (responses) => {
                                    const newResults = responses.map(response => response.data)
                                    // console.log(newResults);
                                    const gameResponse = postGame(actualPlayer.duration, newResults, users, messages);
                                }
                            )


                        }

                        navigate("/");
                        // window.location.reload();

                        dispatch({
                            type: "CLEAR_STATE"
                        });
                    },
                    (error) => {
                        if (Array.isArray(error.response.data.message)) {
                            setErrors(error.response.data.message)
                            setSingleError("");
                        } else {
                            setSingleError(error.response.data.message)
                            setErrors([]);
                        }
                    }
                );
            } else {
                await AuthService.signUp(name, userName, password).then(
                    async (answ) => {

                        navigate("/");
                        // window.location.reload();

                        dispatch({
                            type: "CLEAR_STATE"
                        });
                    },
                    (error) => {
                        if (Array.isArray(error.response.data.message)) {
                            setErrors(error.response.data.message)
                            setSingleError("");
                        } else {
                            setSingleError(error.response.data.message)
                            setErrors([]);
                        }
                    }
                );
            }
        } catch (err) {
            // console.log(err);
        }

    }

    return (
        <div className='Registration'>
            <div className='AbsolutePanel'>
                <div className='Panel' style={errors.length > 0 || singleError ? {
                    boxShadow: "0 0 64px 32px rgba(184, 0, 0, 0.2), inset 0 0 16px 8px rgba(228, 0, 0, 0.8)",
                } : {
                    boxShadow: "0 0 64px 16px rgba(184, 104, 0, 0.2), inset 0 0 32px 16px rgba(228, 129, 0, 0.2)",
                }}>
                    <h1>Regisztráció</h1>
                    <form onSubmit={handleRegister} className="Form">
                        <input
                            className='Input'
                            type="text"
                            placeholder='Játékos név'
                            defaultValue={actualPlayer?.name ? actualPlayer.name : name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className='Input'
                            type="text"
                            placeholder='Felhasználó név'
                            defaultValue={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            className='Input'
                            type="password"
                            placeholder="Jelszó"
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type='submit'>Regisztráció</button>
                    </form>
                    <div className='Nav'>
                        <nav>
                            <Link className='Button' to="/bejelentkezes">Bejelentkezés</Link>
                        </nav>
                        <nav>
                            <Link className='Button' to="/">Vissza</Link>
                        </nav>
                    </div>
                    {errors.length > 0 && <div className='RegErrorPanel'>{errors.map((error, i) => <p key={i++}>{error}</p>)}</div>}
                    {singleError && <div className='RegErrorPanel'>{singleError}</div>}
                </div>
            </div>
        </div>
    );
}