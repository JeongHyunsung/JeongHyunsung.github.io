import '../styles/App.css';
import '../styles/googlebutton.css';

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom';

import {GoogleLogin} from '@react-oauth/google'

import {toast} from 'react-toastify'
import { setUserFetched, setUserInfo } from '../store/actions/actions';

import { useDispatch, useSelector } from 'react-redux';
 
import { useMediaQuery } from "react-responsive"

function Header(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isFetched = useSelector((state)=>state.auth.isFetched)
  const userInfo = useSelector((state)=>state.auth.userInfo)
  const [isLoginDisplay, setIsLoginDisplay] = useState(false)
  

  useEffect(()=>{
    const checkLoginStatus = async()=>{
      try{
        const response = await axios.get('/auth/post/checklogin')
        if(response.data.isLoggedIn){
          dispatch(setUserFetched(true))
          dispatch(setUserInfo(response.data.userInfo))
        }
        else{
          dispatch(setUserFetched(true))
          dispatch(setUserInfo({}))
        }
      }
      catch(error){
        toast.error("Fetch error")
      }
    }
    checkLoginStatus()
  }, [dispatch])

  const handleLoginButtonClicked = ()=>{
    setIsLoginDisplay(true)
  }
  const handleReturnButtonClicked = ()=>{
    setIsLoginDisplay(false)
  }
  const handleLogoutButtonClicked = async ()=>{
    dispatch(setUserFetched(false))
    try{
      await axios.post('/auth/post/googlelogout')
      toast.success("Logout Success")
      navigate('/')
      dispatch(setUserInfo({}))
      dispatch(setUserFetched(true))
    }
    catch(error){
      toast.error("Logout fail")
      dispatch(setUserFetched(true))
    }
  }

  const handleGoogleLogin = async (credentialRes) =>{
    dispatch(setUserFetched(false))
    try{
      const res = await axios.post('/auth/post/googlelogin', {credential: credentialRes.credential, redirect_url:"https://refactored-space-barnacle-q5v997wpr5xh5xv-3000.app.github.dev"})
      dispatch(setUserInfo(res.data.userInfo))
      dispatch(setUserFetched(true))
      setIsLoginDisplay(false)
      toast.success("Login Success")
    }
    catch(error){
      toast.error("Login Fail")
      dispatch(setUserFetched(true))
    }
  }

  const handleProfileIconClicked = ()=>{
    if(userInfo.userName){
      navigate('/profile')
    }
    else{
      toast.error('Invalid route')
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
      <div className="login-button-container">
        {isFetched && (userInfo.userName? 
        <button 
          className="login-button c-bwh c-ddb cur-pt t-heavy"
          onClick={handleLogoutButtonClicked}>Logout</button>:
        <button 
          className="login-button c-bwh c-ddb cur-pt t-heavy"
          onClick={handleLoginButtonClicked}>Log In</button>
        )}
      </div>
      <div className="profile-container d-flex-r d-ac d-jc">
        {(isFetched && userInfo.userPic) ? 
          <img className="profile-icon cur-pt"src={userInfo.userPic} onClick={handleProfileIconClicked}/>:
          <img className="profile-icon cur-pt" src="/empty_profile.svg" alt=""/>}
      </div>
      {isLoginDisplay && 
      <div className="modal-overlay">
        <div className="modal-content c-bwh d-flex-c d-ac g-1r c-ddb">
          <GoogleLogin
            onSuccess={credentialResponse =>{ handleGoogleLogin(credentialResponse) }}
            onError={()=>{toast.error("Login Fail")}}/>
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