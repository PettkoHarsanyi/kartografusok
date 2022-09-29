import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../auth/auth.service';

export default function Registration() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors,setErrors] = useState([]);
    const [name,setName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            await AuthService.signUp(name,userName,password).then(
                ()=>{
                    navigate("/");
                    window.location.reload();
                },
                (error)=>{
                    setErrors(error.response.data.message)
                }
            );
        } catch (err){
            console.log(err);
        }
    }

    return(
        <div>
            <form onSubmit={handleRegister}>
                <h3>Regisztráció</h3>
                {errors && errors.map((error,i)=><p key={i++}>{error}</p>)}
                <input
                    type="text"
                    placeholder='Felhasználó név'
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder='Játékos név'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button type='submit'>Regisztráció</button>
            </form>
            <nav>
                <li>
                    <Link to="/bejelentkezes">Bejelentkezés</Link>
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