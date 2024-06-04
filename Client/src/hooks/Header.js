import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'
import Context from '../utils/context'

import { useAuth0 } from "@auth0/auth0-react"

function Header(){
    const context = useContext(Context)
    const sgs = (x)=>{context.sgs(x)}
    return(
      <div className="Head">
        <div className ="button" onClick={()=>{sgs(0)}}>
          <img className="icon" src="favicon.svg" alt=""/>
          {/*<p className="title">Hyunsung Jeong</p>*/}
        </div>
        <div className="global-nav">
          <NavButton nm="Blog" cur_num={1}/>
          <NavButton nm="Project" cur_num={2}/>
          <NavButton nm="About Me" cur_num={3}/>
        </div>
      </div>
    )
  }
  

function NavButton({nm, cur_num}){
    const context = useContext(Context)
    const sgs = (x)=>{context.sgs(x)}
    const [isover, setIsover] = useState(false)
    const [isInit, setIsInit] = useState(true)
    const am_1 = "wider 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
    const am_2 = "narrower 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
    return(
      <div 
        className="navigation-button"
        onMouseOver={()=>{setIsover(true);setIsInit(false)}}
        onMouseLeave={()=>{setIsover(false)}}
        onClick={()=>{sgs(cur_num)}}
        style={{top: (isover)?"-3px":"0px"}}>
        <p style={{color: (isover)?"var(--col-h1)":"var(--col-pp)",
                   fontWeight: (isover)?"600":"500"}}>
          {nm}
        </p>
        <div 
          className="underline"
          style={{animation:(!(isInit) && isover)?am_1:(!isInit)?am_2:"none",
                  width:(isover)?"100%":"0%"}}></div>
      </div>
    )
}

export default Header