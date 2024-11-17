import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

import { useSelector } from 'react-redux';

import SearchResult from './elements/SearchResult'

function Home(){
  const userIsAdmin = useSelector((state)=>state.auth.userInfo.userIsAdmin)

  return(
    <div className="Home d-flex-c">
      <div className="recent-works d-flex-c">
        <hr className="c-bgr w-100"/>
        <h2 className="t-spacing c-wh t-bb t-light">Recent Posts</h2>
        <SearchResult condition={{search: {}, sort: {field: "upload_date", order: "desc"}}}/>
      </div>
    </div>
  )
}

export default Home