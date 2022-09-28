import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export default function Leaderboard() {
    const AllAndWeekly = useLoaderData();
    const AllTimeUsers = AllAndWeekly[0];
    const WeeklyUsers = AllAndWeekly[1];
    return(
        <div>
            <h1>Welcome to Leaderboard</h1>
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <h1>Összes</h1>
            {AllTimeUsers ? (
            <ul>
              {AllTimeUsers.map((user) => (
                <li key={user.id}>
                  {user.name} - {user.points}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No users</i>
            </p>
          )}
          <h2>Heti</h2>
            {WeeklyUsers ? (
            <ul>
              {WeeklyUsers.map((user) => (
                <li key={user.id}>
                  {user.name} - {user.weekly}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No users</i>
            </p>
          )}
        </div>
    );
}