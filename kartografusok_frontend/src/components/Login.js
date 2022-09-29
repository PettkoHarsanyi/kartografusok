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
            <div className='Panel'>
                <h1>Bejelentkezés</h1>
                
                {error && <p>{error}</p>}
                    
                <form onSubmit={handleLogin} className="Form">
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
                        <Link className='Button' to="/regisztracio">Regisztracio</Link>
                    </nav>
                    <nav>
                        <Link className='Button' to="/">Vissza</Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}