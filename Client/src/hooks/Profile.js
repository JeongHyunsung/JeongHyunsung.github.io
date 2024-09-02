import '../styles/App.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { Link, useRouteError, useNavigate } from 'react-router-dom';

import {GoogleLogin} from '@react-oauth/google'

import {toast} from 'react-toastify'
import { setUserFetched, setUserInfo } from '../store/actions/actions';

import { useDispatch, useSelector } from 'react-redux';

function Profile({}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isFetched = useSelector((state)=>state.auth.isFetched)
    const userInfo = useSelector((state)=>state.auth.userInfo)

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

    const handleRemoveButtonClicked = async ()=>{
        dispatch(setUserFetched(false))
        const confirmed = window.confirm("회원탈퇴 시 본 사이트의 데이터베이스에 저장된 사용자의 모든 댓글, 문의는 삭제되며, 수집된 모든 개인정보는 영구히 삭제됩니다. 진행하시겠습니까?");
        if (!confirmed) {
            return
        }
        try{
            await axios.post('/auth/post/googlelogoutwithdeletion')
            toast.success("Account Deletion Success")
            navigate('/')
            dispatch(setUserInfo({}))
            dispatch(setUserFetched(true))
        }
        catch(error){
            toast.error("Account Delection fail")
            dispatch(setUserFetched(true))
        }
        return
    }

    return(
        <div className="profile d-flex-c g-05r">
            <h1 className="profile-title t-bbb t-reg">Profile</h1>
 
            <h2>댓글 기록</h2>
            <div className="my-record"></div>
            <h2>문의 기록</h2>
            <div className="my-record"></div>

            <button className="profile-button cur-pt c-bwh t-heavy" onClick={handleLogoutButtonClicked}>{userInfo.userName} 계정 로그아웃</button>
            <button className="profile-button cur-pt c-brd t-heavy" onClick={handleRemoveButtonClicked}>{userInfo.userName} 계정 회원 탈퇴</button>




        </div>
    )
}

export default Profile