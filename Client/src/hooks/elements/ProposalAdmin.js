import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

function ProposalAdmin({}){
    const [detailDisplayed, setDetailDisplayed] = useState(false);

    const handleDetailClicked = ()=>{
        setDetailDisplayed(!detailDisplayed)
    }
    return(
        <div className="proposal d-flex-c">
            <div className="d-flex-r d-ac g-05r">
                <h1>제안 내역</h1>
            </div>
        </div>
    )
}

export default ProposalAdmin