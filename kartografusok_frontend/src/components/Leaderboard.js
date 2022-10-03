import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import "../css/Leaderboard.css";
import bronz from "../assets/bronze.png";
import ezust from "../assets/ezust.png"
import arany from "../assets/arany.png"
import platina from "../assets/platina.png"

export default function Leaderboard() {

  const allAndWeekly = useLoaderData();
  const [allTimeUsers] = useState(allAndWeekly[0]);
  const [weeklyUsers] = useState(allAndWeekly[1]);
  const [allShown,setAllShown] = useState(true);

  const [shownPlayers, setShownPlayers] = useState(allTimeUsers);

  const setDiv = (id) => {
    if (id===1) {
      return <img src={bronz} className="Pics" alt="profilpics" />
    }
    if (id===2) {
      return <img src={ezust} className="Pics" alt="profilpics" />
    }
    if (id===3) {
      return <img src={arany} className="Pics" alt="profilpics" />
    }
    if (id===4) {
      return <img src={platina} className="Pics" alt="profilpics" />
    }
  }

  return (
    <div className='Leaderboard'>
      <div className='Panel'>
        <div className='PanelDiv1'>
          <div className='SpaceholderDiv'>
            <Link className='Button' id='homebutton' to="/">Vissza</Link>
          </div>
          <div className='ButtonDiv'>
            <button className='Button' id="allButton" onClick={()=>{setShownPlayers(allTimeUsers);setAllShown(true);}} style={allShown?{
              boxShadow: "0 8px 16px 0 rgba(228, 129, 0, 0.2), inset 12px 6px 12px 0 rgba(0, 0, 0, 0.909)"  
            }:{
              boxShadow: "0 8px 16px 0 rgba(228, 129, 0, 0.2), inset 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }}>Összes</button>
            <button className='Button' id="weekButton" onClick={()=>{setShownPlayers(weeklyUsers);setAllShown(false);}} style={allShown?{
              boxShadow: "0 8px 16px 0 rgba(228, 129, 0, 0.2), inset 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
            }:{
              boxShadow: "0 8px 16px 0 rgba(228, 129, 0, 0.2), inset 12px 6px 12px 0 rgba(0, 0, 0, 0.909)"  
            }}>Heti</button>
          </div>
          <div className='SpaceholderDiv'></div>
        </div>

        <div className='PanelDiv2'>
          {shownPlayers ? (
              shownPlayers.map((user,i) => (
                <div key={user.id} className='PlayerDiv'>
                  <div>{i+1}. {setDiv(user.division.id)} {user.name} </div>
                  <div>|</div>
                  <div>{allShown ? (" összes pont: " + user.points) : ("heti pont: " + user.weekly)} </div>
                  <div>|</div>
                  <div>divízió: {user.division.name}</div>
                </div>
                
              ))
          ) : (
            <p>
              <i>No users</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}