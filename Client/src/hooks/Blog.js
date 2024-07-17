import '../styles/App.css';

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import SearchResult from './elements/SearchResult'


function Blog(){
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    })
    const isPc = useMediaQuery({
        query : "(min-width:1024px)"
    })
    
    const num_columns = isMobile?1:(isPc?3:2)
    const wdh = ((102-(num_columns * 2))/num_columns).toString() + "%"
    const columns = Array.from({length: num_columns}, () => 0)
    return (
        <div className="d-flex-c">
            <h1 className="t-bbb t-reg">BLOG</h1>
            <Link to="/addpost" className="addpost-button c-bwh"></Link>
            <div className="recent-works d-flex-c">
                <hr className="c-bgr w-100"/>
                <h2 className="t-spacing c-wh t-bb t-light">Recent Posts</h2>
                <SearchResult condition={{search: {}, sort: {field: "title", order: "desc"}}}/>
            </div>
        </div>
    )
}

export default Blog