import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../auth/auth.service';
import "../css/Login.css";


export default function Login() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");

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
                    setError(error.response.data.message);
                }
            );
        } catch (err){
            console.log(err);
        }
    }

    return(
        <div className='Login'>
            <div className='AbsolutePanel'>
                <div className='Panel' style={error ? {
                    boxShadow: "0 0 64px 32px rgba(184, 0, 0, 0.2), inset 0 0 16px 8px rgba(228, 0, 0, 0.8)",
                }: {
                    boxShadow: "0 0 64px 16px rgba(184, 104, 0, 0.2), inset 0 0 32px 16px rgba(228, 129, 0, 0.2)",
                }}>
                    <h1>Bejelentkezés</h1>                    
                    <form onSubmit={handleLogin} className="Form" autoComplete='off'>
                        <input
                            className='Input'
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
                        <button type='submit'>Tovább</button>
                    </form>
                    <div className='Nav'>
                        <nav>
                            <Link className='Button' to="/regisztracio">Regisztráció</Link>
                        </nav>
                        <nav>
                            <Link className='Button' to="/">Vissza</Link>
                        </nav>
                    </div>
                    {error && <div className='ErrorPanel'>{error}</div>}
                </div>
            </div>
        </div>
    );
}