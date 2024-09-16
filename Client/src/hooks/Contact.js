import '../styles/App.css';
import '../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

import ChatBox from './elements/ChatBox'
import Proposal from './elements/Proposal'

function Contact({}){
    return(
        <div className="contact d-flex-r d-flex-wrap d-ac">
            <ChatBox />
            <Proposal />
        </div>
    )
}

export default Contact
