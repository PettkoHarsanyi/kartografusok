import React from 'react';
import "../css/Rules.css";
import { Link } from 'react-router-dom';
import first from "../assets/rules/1.png"
import second from "../assets/rules/2.png"
import third from "../assets/rules/3.png"
import fourth from "../assets/rules/4.png"
import fiveth from "../assets/rules/5.png"
import sixth from "../assets/rules/6.png"

export default function Rules() {
    return (
        <div className='Rules'>
            <Link className='Button' to="/">Vissza</Link>
            <div className='Images'>
                <img className='Img' src={first} />
                <img className='Img' src={second} />
                <img className='Img' src={third} />
                <img className='Img' src={fourth} />
                <img className='Img' src={fiveth} />
                <img className='Img' src={sixth} />
                {/* <nav>
                <Link to="/">Home</Link>
            </nav> */}
            </div>
        </div>
    );
}