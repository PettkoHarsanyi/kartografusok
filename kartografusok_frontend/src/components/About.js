import React from 'react';
import { Link } from 'react-router-dom';

export function About() {
    return(
        <div>
            <h1>Welcome to About</h1>
            <p>This game is Kartografusok</p>
            <nav>
                <Link to="/">Home</Link>
            </nav>
        </div>
    );
}