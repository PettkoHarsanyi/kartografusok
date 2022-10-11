import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../css/ConnectRoom.css";

export default function ConnectRoom() {
    const [code, setCode] = useState("");

    const handleChange = async (e) => {
        await setCode(e.target.value);
    }

    return(
        <div className='ConnectRoom'>
            <div className='Div2'>
                <div className='Div3'>
                    <div className='Div4'>Szobakód:</div>
                    <input className='Div5' onChange={(e)=>{handleChange(e)}}></input>
                </div>
                <div className='Div6'>
                    <Link to="/">Vissza</Link>
                    <Link onClick={()=>console.log(code)}>Belépés</Link>
                </div>
            </div>
        </div>
    );
}