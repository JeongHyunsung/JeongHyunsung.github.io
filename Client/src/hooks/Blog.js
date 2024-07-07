import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Blog(){
    return (
        <div className="d-flex-c">
            <h1>BLOG</h1>
        </div>
    )
}

export default Blog