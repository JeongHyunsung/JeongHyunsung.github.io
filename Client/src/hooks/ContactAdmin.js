import '../styles/App.css';
import '../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

import ChatBoxAdmin from './elements/ChatBoxAdmin'
import ProposalAdmin from './elements/ProposalAdmin'



function ContactAdmin({}){
    return(
        <div className="contact d-flex-r d-flex-wrap g-1r">
            <ChatBoxAdmin/>
            <ProposalAdmin/>
        </div>
    )
}

export default ContactAdmin
