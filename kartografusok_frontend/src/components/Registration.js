import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../auth/auth.service';
import "../css/Registration.css";


export default function Registration() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errors,setErrors] = useState([]);
    const [singleError,setSingleError] = useState("");
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
                    if(Array.isArray(error.response.data.message)){
                        setErrors(error.response.data.message)
                        setSingleError("");
                    }else{
                        setSingleError(error.response.data.message)
                        setErrors([]);
                    }
                }
            );
        } catch (err){
            console.log(err);
        }
    }

    return(
        <div className='Registration'>
            <div className='AbsolutePanel'>
                <div className='Panel' style={errors.length > 0 || singleError ? {
                    boxShadow: "0 0 64px 32px rgba(184, 0, 0, 0.2), inset 0 0 16px 8px rgba(228, 0, 0, 0.8)",
                }: {
                    boxShadow: "0 0 64px 16px rgba(184, 104, 0, 0.2), inset 0 0 32px 16px rgba(228, 129, 0, 0.2)",
                }}>
                    <h1>Regisztráció</h1>
                    <form onSubmit={handleRegister} className="Form">
                        <input
                            className='Input'
                            type="text"
                            placeholder='Játékos név'
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <input
                            className='Input'
                            type="text"
                            placeholder='Felhasználó név'
                            value={userName}
                            onChange={(e)=>setUserName(e.target.value)}
                        />
                        <input
                            className='Input'
                            type="password"
                            placeholder="Jelszó"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
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
                    {errors.length>0 && <div className='RegErrorPanel'>{errors.map((error,i)=><p key={i++}>{error}</p>)}</div>}
                    {singleError && <div className='RegErrorPanel'>{singleError}</div>}
                </div>
            </div>
        </div>
    );
}