import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'
import {toast} from 'react-toastify'
import { useMediaQuery } from "react-responsive"

import dateConversion from '../../utils/dateConversion'



import { initializeSocket, getSocket } from '../../utils/socket'
import axios from 'axios';

function Message({content, isSent, createdAt}){
    return(
        <div className={"message d-flex-c" + (isSent?" sent":"")}>
            <p className="t-s c-gr">{createdAt}</p>
            <p>{content}</p>

        </div>
    )
}

export default Message