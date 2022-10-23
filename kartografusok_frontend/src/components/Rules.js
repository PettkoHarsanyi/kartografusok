import React from 'react';
import "../css/Rules.css";
import { Link } from 'react-router-dom';
import first from "../assets/rules/1.png"
import second from "../assets/rules/2.png"
import third from "../assets/rules/3.png"
import fourth from "../assets/rules/4.png"
import fiveth from "../assets/rules/5.png"
import sixth from "../assets/rules/6.png"
import seventh from "../assets/rules/6.png"
import ScrollContainer from 'react-indiana-drag-scroll'

export default function Rules() {
    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function (e) {
        const ele = document.getElementById('container');

        pos = {
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };
    
    };

    return (
        <div className='Rules'>
            <Link className='Button' to="/">Vissza</Link>
            <ScrollContainer  className='Images' id="container" onDrag={e=>mouseDownHandler(e)}>
                <img className='Img' src={first} />
                <img className='Img' src={second} />
                <img className='Img' src={third} />
                <img className='Img' src={fourth} />
                <img className='Img' src={fiveth} />
                <img className='Img' src={sixth} />
                <img className='Img' src={seventh} />
                {/* <nav>
                <Link to="/">Home</Link>
            </nav> */}
            </ScrollContainer >
        </div>
    );
}