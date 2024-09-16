import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

const io = require('socket.io-client');

function ChatDisplay({}){
    const socket = io('https://refactored-space-barnacle-q5v997wpr5xh5xv-5000.app.github.dev', {
        withCredentials: true
    })
    useEffect(()=>{
        socket.on('connect', ()=>{
            console.log('Connected')
        })
        socket.on('connect_error', (error)=>{
            console.log(error)
        })
    }, [])
    
    
    

    
    return(
        <div className="chatdisplay">
        </div>
    )
}

export default ChatDisplay
