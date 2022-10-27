import deleteIcon from "../../assets/delete.png"
import card_back_png from "../../assets/card_back.png"
import React, { } from 'react';
import ExploreCard from "./ExploreCard";
import RaidCard from "./RaidCard";
import RuinCard from "./RuinCard";

export default function Card({ card, handleDeleteCard }) {
    const flipCard = (e) => {
        const inner = e.target.parentElement.closest('div.FlipCardInner');
        inner.style = "transform: rotateY(180deg)"
        // e.target.style = "transform: rotateY(180deg)";
    }

    const flipBackCard = (e) => {
        const inner = e.target.parentElement.closest('div.FlipCardInner');
        inner.style = "transform: rotateY(0deg)"
        // e.target.style = "transform: rotateY(180deg)";
    }

    return (
        <div className="FlipCard" >
            <div className="FlipCardInner">
                <div className="FlipCardFront">
                    <div className="CardFront" onClick={(e) => flipCard(e)}>
                        <img src={`api/cards/${card.id}/cardimage`} className="Card" />
                        {card.official && <div className="FlipCardFrontLayer" ><div>Hivatalos</div></div>}
                        {!card.official &&
                            <>
                                {card.cardType === "EXPLORE" && <ExploreCard card={card} />}
                                {card.cardType === "RAID" && <RaidCard card={card} />}
                                {card.cardType === "RUIN" && <RuinCard card={card} />}
                                <div className="FlipCardFrontLayer" >
                                    <img onClick={() => handleDeleteCard(card)} src={deleteIcon} alt="delete" />
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="FlipCardBack">
                    <div className='CardBack' onClick={(e) => flipBackCard(e)} >
                        <img className='CardBackImg' src={card_back_png} />
                        {/* <div className='CardBackText'>
                            {card.duration && <div className='Attribute'>{card.duration}</div>}

                            <div className='Attribute'>{card.name}</div>
                            {card.fieldType1 && <div className='Attribute'>{card.fieldType1} {card.fieldType2}</div>}
                            
                            {card.direction && <div className='Attribute'>{card.direction == 1 ? "Óra járásával megegyezően" : "Óra járásával ellentétesen"}</div>}

                            {(card.blocks1 || card.blocks2) &&
                                <div className='BlocksDiv'>
                                    {card.blocks1 && card.blocks1.length > 0 &&
                                        <div className="divTable">
                                            <div className="divTableBody">
                                                {JSON.parse(card.blocks1).map((row, index) => {
                                                    return (
                                                        <div key={index} className="divTableRow">
                                                            {row.map((cell, index) => {
                                                                return (
                                                                    <div key={index} className="divTableCell" style={{ border: cell === 0 ? "0vh" : "0.1vh solid white" }}></div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    }

                                    {card.blocks2 && card.blocks2.length > 0 &&
                                        <div className="divTable">
                                            <div className="divTableBody">
                                                {JSON.parse(card.blocks2).map((row, index) => {
                                                    return (
                                                        <div key={index} className="divTableRow">
                                                            {row.map((cell, index) => {
                                                                return (
                                                                    <div key={index} className="divTableCell" style={{ border: cell === 0 ? "0vh" : "0.1vh solid white" }}></div>
                                                                )
                                                            })}
                                                        </div>
                                                    )
                                                })
                                                }
                                            </div>
                                        </div>
                                    }

                                </div>}

                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}