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

import { disconnectSocket } from '../utils/socket';

function Header(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const isFetched = useSelector((state)=>state.auth.isFetched)
  const userInfo = useSelector((state)=>state.auth.userInfo)
  const [isLoginDisplay, setIsLoginDisplay] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)


  console.log(userInfo)
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
      disconnectSocket()
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

  const handleColorModeChanged = ()=>{
    setIsDarkMode(!isDarkMode)
    if(isDarkMode) {
      root.style.setProperty('--col-ddb', '#0B0C10');
      root.style.setProperty('--col-db', '#1F2833');
      root.style.setProperty('--col-gr', '#C5C6C7');
      root.style.setProperty('--col-lb', '#66FCF1');
      root.style.setProperty('--col-mb', '#45A29E');
      root.style.setProperty('--col-wh', '#FFFFFF');
    } else {
      root.style.setProperty('--col-ddb', '#D1D1D1');
      root.style.setProperty('--col-db', '#FFFFFF');
      root.style.setProperty('--col-gr', '#424242');
      root.style.setProperty('--col-lb', '#48CFCB');
      root.style.setProperty('--col-mb', '#229799');
      root.style.setProperty('--col-wh', '#424242');
    }
  }

  

  return(
    <div className="Head d-ac w-100 d-flex-r">
      <div className="login-button-container m-la">
        {isFetched && (userInfo.userId? 
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

export default Header