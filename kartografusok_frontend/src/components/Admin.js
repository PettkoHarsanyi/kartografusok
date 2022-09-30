import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
  

export default function Admin(){
    const users = useLoaderData();
    return(
        <div>
            <h1>Admin Page Is Coming Soon</h1>
            <nav>
                <Link to="/">Home</Link>
            </nav>

            <ul>
                <li>Név    Felhasználónév    Email   Divízió    Némítva   Tiltva  Jogosultság    Pont  Heti pont</li>
                {users && users.map((user)=>
                    (<li key={user.id}>{user.name}  {user.userName} {user.email}    {user.division.name}    {user.muted}    {user.banned}    {user.role}    {user.points}   {user.weekly}</li>)
                )}
            </ul>
        </div>
    );
}