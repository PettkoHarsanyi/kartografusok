import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
    return(
        <div>
            <h1>Welcome to Home</h1>
            <nav>
                <Link to="/about">About</Link>
            </nav>
        </div>
    );
}