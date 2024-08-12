import '../styles/App.css';
import '../styles/googlebutton.css';

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { Link } from 'react-router-dom';
import Context from '../utils/context'

import {GoogleLogin} from '@react-oauth/google'

import {toast} from 'react-toastify'

import { useMediaQuery } from "react-responsive"

function Header(){
  const [isLogin, setIsLogin] = useState(false)
  const [isLoginDisplay, setIsLoginDisplay] = useState(false)

  const handleLoginButtonClicked = ()=>{
    setIsLoginDisplay(true)
  }
  const handleReturnButtonClicked = ()=>{
    setIsLoginDisplay(false)
  }

  const handleGoogleLogin = async (credentialRes) =>{
    try{
      const res = await axios.post('/api/post/GoogleLogin', {token: credentialRes.credential})
      console.log(res.data)
    }
    
    catch(error){
      console.log(error)
    }
  }
  

  return(
    <div className="Head d-ac w-100 d-flex-r">
      <Link to = "/" className ="button d-flex-r">
        <img className="icon" src="/favicon.svg" alt=""/>
      </Link>
      <div className="global-nav d-flex-r">
        <NavButton nm="Blog" cur="blog"/>
        <NavButton nm="Project" cur="project"/>
        <NavButton nm="About Me" cur="aboutme"/>
      </div>
      {isLogin? 
      <button 
        className="login-button c-bwh c-ddb cur-pt t-heavy"
        onClick={handleLogoutButtonClicked}>Logout</button>:
      <button 
        className="login-button c-bwh c-ddb cur-pt t-heavy"
        onClick={handleLoginButtonClicked}>Log In</button>
      }
      <img className="empty-profile cur-pt" src="/empty_profile.svg" alt=""/>
      
      {isLoginDisplay && 
      <div className="modal-overlay">
        <div className="modal-content c-bwh d-flex-c d-ac g-1r c-ddb">
          <GoogleLogin
            onSuccess={credentialResponse =>{ handleGoogleLogin(credentialResponse) }}
            onError={()=>{toast.error("FAIL")}}/>
          <button 
            className="return-button c-bwh c-ddb cur-pt t-heavy"
            onClick={handleReturnButtonClicked}>돌아가기</button>
        </div>
      </div>
      }

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