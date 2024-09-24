import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"
import { useSelector } from 'react-redux';

import ChatDisplayContainer from './ChatDisplayContainer'
import { toast } from 'react-toastify';
import axios from 'axios';

function ChatBoxAdmin({}){
    const userId = useSelector((state)=>state.auth.userInfo.userId)
    const [contactUidList, setContactUidList] = useState([]) 

    useEffect(()=>{
        const fetchContactUidList = async()=>{
            try{
                const res = await axios.get('/message/get/contactusers')
                setContactUidList(res.data.map((value)=>value.uid))
                console.log(res.data.map((value)=>value.uid))

            }catch(error){
                console.log(error)
                toast.error("Error Fetch user list")
            }
        }
        fetchContactUidList()
    },[])
    return(
        <div className="chatbox d-flex-c g-1r">
            <h1>문의 내역</h1>
            <div className="d-flex-c g-05r">
            {contactUidList.map((uid, index)=>{
                return(<ChatDisplayContainer userId={userId} otherId={uid} isAdmin={true} key={uid.toString()}/>)
            })}
            </div>
        </div>
    )
}

export default ChatBoxAdmin