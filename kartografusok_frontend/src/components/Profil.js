import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import authService from '../auth/auth.service';
import "../css/Profil.css";
import bronz from "../assets/bronze.png";
import ezust from "../assets/ezust.png"
import profilpics from "../assets/user_130x130px.png"
import arany from "../assets/arany.png"
import platina from "../assets/platina.png"


export default function Profil() {
    const [frame, setFrame] = useState();
    const [decoration, setDecoration] = useState({});
    const [user] = useState(authService.getCurrentUser());

    const userMatches = useLoaderData();

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

    return (
        <div className='Profil'>
            <Link className='Button' to="/">Vissza</Link>
            <div className='Div1'>
                <div className='Div2'>
                    <div className='Pics'>
                        <img src={frame} className="ProfileFrame" alt="profilframe" style={decoration} />
                        <img src={profilpics} className="ProfilePics" alt="profilpics" />
                    </div>
                    <div className='Name'>{user.name}</div>
                </div>
                <div className='Points'>
                    <div className='Info'>
                        <h1>Összes pont</h1>
                        <div>{user.points}</div>
                    </div>
                    <div className='Info'>
                        <h1>Heti pont</h1>
                        <div>{user.weekly}</div>
                    </div>
                    <div className='Info'>
                        <h1>Divízió</h1>
                        <div>{user.division.name.charAt(0).toUpperCase() + user.division.name.slice(1)}</div>
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