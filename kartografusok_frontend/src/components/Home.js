import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../auth/auth.service';
import "../css/Home.css";
import logo from "../assets/kart_felirat.png";

export default function Home() {
    const user = authService.getCurrentUser();
    return(
        <div className='Home'>
            <div className='Wrapper'> 
                <img src={logo} className="Logo" alt="logo" />
                <div className='Home-panel'>
                    {user ? (<>
                        <Link to="/adminisztracio">Admin</Link>
                        <Link to="/rangletra">Ranglétra</Link>
                        <Link to="/szabalyzat">Szabályzat</Link>
                        <a onClick={()=>{authService.logOut(); window.location.reload()}} href="/">Kilépés</a>
                    </>) : (<>
                        <Link to="/bejelentkezes">Belépés</Link>
                        <Link to="/regisztracio">Regisztráció</Link>
                    </>)}
                </div>
            </div>
        </div>
    );
}