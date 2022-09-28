import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../auth/auth.service';

export default function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await AuthService.logIn(userName,password).then(
                ()=>{
                    navigate("/");
                    window.location.reload();
                },
                (error)=>{
                    console.log(error)
                }
            );
        } catch (err){
            console.log(err);
        }
    }

    return(
        <div>
            <form onSubmit={handleLogin}>
                <h3>Bejelentkezés</h3>
                <input
                    type="text"
                    placeholder='Felhasználó név'
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button type='submit'>Bejelentkezés</button>
            </form>
            <nav>
                <li>
                    <Link to="/regisztracio">Regisztracio</Link>
                </li>
            </nav>
            <nav>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </nav>
        </div>
    );
}