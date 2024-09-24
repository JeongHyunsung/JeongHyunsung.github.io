import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect, useRef } from 'react';

import {toast} from 'react-toastify'
import { useMediaQuery } from "react-responsive"
import axios from 'axios';

import ChatDisplay from './ChatDisplay'


function ChatDisplayContainer({userId, otherId, isAdmin}){
    const [isDisplay, setIsDisplay] = useState(!isAdmin)
    const [otherName, setOtherName] = useState("")
    useEffect(()=>{
        const fetchOtherName = async()=>{
            try{
                const res = await axios.get("/auth/get/otherusername", {params: {otherId: otherId}})
                setOtherName(res.data[0].name)
            }catch(error){
                toast.error("Error Fetch other user name")
                console.log(error)
            }
        }
        fetchOtherName()
    }, [otherId, userId])

    const handleDisplayButtonClicked = ()=>{
        setIsDisplay(prev=>(!prev))
    }
    return(
        <div className="chatdisplay-container d-flex-c d-ac">
            <div className="d-flex-r d-ac d-jsb w-100 c-bdb">
                <h5 className="chat-header t-b c-wh">{isAdmin?otherName+" 님의 문의":"채팅으로 문의하기"}</h5>
                <button
                    className="chat-display-button"
                    onClick={handleDisplayButtonClicked}
                >
                    {isDisplay?
                    <img src="/triangle.svg" alt=""/>:<img src="/reversetriangle.svg" alt=""/>}
                </button>
            </div>
            {isDisplay && <ChatDisplay userId={userId} otherId={otherId}/>}
        </div>
    )
}

export default ChatDisplayContainer