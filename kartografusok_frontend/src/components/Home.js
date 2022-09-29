import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../auth/auth.service';
import "../css/Home.css";
import logo from "../assets/kart_felirat.png";
import bronz from "../assets/bronze.png";
import ezust from "../assets/ezust.png"
import arany from "../assets/arany.png"
import platina from "../assets/platina.png"
import profilpics from "../assets/user_130x130px.png"

export default function Home() {
    const [frame,setFrame] = useState();
    const [decoration,setDecoration] = useState({});
    const [user] = useState(authService.getCurrentUser());
    
    useEffect(()=>{
        if(user){
            switch (user.division.id) {
                case 2:
                    setFrame(ezust);
                    setDecoration({boxShadow: "0 0 3vh 3vh rgba(170, 209, 222, 0.918), inset 0 0 32px 3vh rgba(170, 209, 222, 0.918)"})
                    break;
                case 3:
                    setFrame(arany)
                    setDecoration({boxShadow: "0 0 6vh 3vh rgba(255, 225, 0, 0.918), inset 0 0 32px 3vh rgba(255, 225, 0, 0.918)"})
                    break;
                case 4:
                    setFrame(platina)
                    setDecoration({boxShadow: "0 0 12vh 6vh rgba(72, 0, 255, 0.901), inset 0 0 32px 3vh rgba(72, 0, 255, 0.901)"})
                    break;
                default:
                    setFrame(bronz);
                    setDecoration({boxShadow: "0 0 3vh 2vh rgba(186, 118, 0, 0.852),inset 0 0 32px 3vh rgba(186, 118, 0, 0.852)"})
                    break;
            }
        }
    },[user])

    return(
        <div className='Home'>
            <div className='Wrapper'> 
                <img src={logo} className="Logo" alt="logo" />
                
                    {user ? (
                        <div className='Div1'>
                            <div className='Div2'>
                                <Link to="/adminisztracio">Admin</Link>
                                <Link to="/profil">Profil</Link>
                            </div>
                            <div className='Div3'>
                                <div className='DivPlaceholder'></div>
                                <div className='Div5'>
                                    <div className='Div5_2'>
                                        <div className='Pics'>
                                            <img src={frame} className="ProfileFrame" alt="profilframe" style={decoration} />
                                            <img src={profilpics} className="ProfilePics" alt="profilpics" />
                                        </div>
                                        <div>
                                            {user && user.name}
                                        </div>
                                    </div>
                                </div>
                                <div className='Div6'>
                                    <Link to="/letrehozas">Létrehozás</Link>
                                    <Link to="/csatlakozas">Csatlakozás</Link>
                                </div>
                                <div className='DivPlaceholder'></div>
                            </div>
                            <div className='Div4'>
                                <Link to="/rangletra">Ranglétra</Link>
                                <Link to="/szabalyzat">Szabályzat</Link>
                                <a onClick={function(e){authService.logOut(e); window.location.reload();}} href="/">Kilépés</a>
                            </div>
                        </div>
                    ) : (
                        <div className='Div11'>
                            <div className='Div10' id='div10'><h3>Kartográfusok</h3><p>Üdv a kartográfusok magyar online játékában.</p><p>A királyság térképészeként a feladatod feltárni a távoli, vad vidéket.</p><p>Rajzold meg az alakzatot, töltsd fel mintával és igazodj a királynő rendeleteihez, hiszen csak ezek hoznak hírnevet.</p><p>Ha az év végére pedig neked lesz a legnagyobb hírneved, maga a királynő emel királyi kartográfus rangra!</p></div>
                            <div className='Div7'>
                                <Link to="/bejelentkezes"><div>Belépés</div></Link>
                                <Link to="/regisztracio"><div>Regisztráció</div></Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
}