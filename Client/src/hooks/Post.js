import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { useParams } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Post(){
    const params = useParams()
    const pid = params.pid
    return(
        <div></div>
    )
}

export default Post