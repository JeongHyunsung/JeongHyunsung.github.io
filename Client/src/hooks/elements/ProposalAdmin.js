import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"
import axios from 'axios';

import dateConversion from '../../utils/dateConversion'

function ProposalAdmin({}){
    const [proposals, setProposals] = useState([])
    useEffect(()=>{
        const fetchProposals = async ()=>{
            const res = await axios.get('/proposal/get/proposal')
            setProposals(res.data)
        }
        fetchProposals()
    }, [])
    return(
        <div className="proposal d-flex-c g-1r">
            <h1>제안 내역</h1>
            <div className="proposals d-flex-c g-05r">
                {proposals.map((proposal, index)=>{
                    return(
                        <Proposal email={proposal.contact_email} title={proposal.title} d={proposal.description} createdAt={dateConversion(proposal.created_at)}/>
                    )
                })}
            </div>
        </div>
    )
}

function Proposal({email, title, d, createdAt}){
    const [isDisplay, setIsDisplay] = useState(false)
    const toggleDisplay = ()=>{
        setIsDisplay(prev=>(!prev))
    }
    return(
        <div className="proposal c-bdb r-smooth-05 g-05r">
            <div className="d-flex-r d-ac g-1r">
                <p>{title}</p>
                <p className="t-s t-gr">{createdAt}</p>
                <p className="t-s t-gr">{email}</p>
                <button
                    className="chat-display-button m-la"
                    onClick={toggleDisplay}>
                    {isDisplay?
                    <img src="/triangle.svg" alt=""/>:<img src="/reversetriangle.svg" alt=""/>}
                </button>
            </div>
            {isDisplay &&
            <p className="c-bddb proposal-details">{d}</p>}        
        </div>
    )
}

export default ProposalAdmin