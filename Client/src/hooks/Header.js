import '../styles/App.css';

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { Link } from 'react-router-dom';
import Context from '../utils/context'
import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Header(){
  const isMobile = useMediaQuery({
    query : "(max-width:767px)"
  })
  const isPc = useMediaQuery({
    query : "(min-width:1024px)"
  });
  const isTablet = useMediaQuery({
    query : "(min-width:768px) and (max-width:1023px)"
  });
  

  return(
    <div className="Head w-100 d-flex-r">
      <Link to = "/" className ="button d-flex-r">
        <img className="icon" src="/favicon.svg" alt=""/>
      </Link>
      <div className="global-nav d-flex-r">
        <NavButton nm="Blog" cur="blog"/>
        <NavButton nm="Project" cur="project"/>
        <NavButton nm="About Me" cur="aboutme"/>
      </div>
    </div>
  )
}
  

function NavButton({nm, cur}){
  const [isover, setIsover] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const am_1 = "wider 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
  const am_2 = "narrower 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
  return(
    <Link 
      to={'/'+cur}
      className="navigation-button"
      onMouseOver={()=>{setIsover(true);setIsInit(false)}}
      onMouseLeave={()=>{setIsover(false)}}
      style={{top: (isover)?"-3px":"0px"}}>
      <p style={{color: (isover)?"var(--col-mb)":"var(--col-wh)",
                 fontWeight: (isover)?"600":"500"}}>
        {nm}
      </p>
      <div 
        className="underline c-bmb"
        style={{animation:(!(isInit) && isover)?am_1:(!isInit)?am_2:"none",
                width:(isover)?"100%":"0%"}}></div>
    </Link>
  )
}

export default Header