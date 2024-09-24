import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"
import { useSelector } from 'react-redux';

import ChatDisplayContainer from './ChatDisplayContainer'

function ChatBox({}){
    const userId = useSelector((state)=>state.auth.userInfo.userId)
    const [detailDisplayed, setDetailDisplayed] = useState(false);
    const handleDetailClicked = ()=>{
        setDetailDisplayed(!detailDisplayed)
    }
    return(
        <div className="chatbox d-flex-c g-1r">
            <div className="chatbox-header">
                <div className="d-flex-r d-ac g-05r">
                    <h1>문의하기</h1>
                    <img className="details" src="/question.svg" onClick={handleDetailClicked}/>
                </div>
                <div className={`detail-container c-bddb ${detailDisplayed ? 'expanded' : ''}`}>
                    <p className="t-b">이곳에서는 웹사이트에서 생긴 문의사항을 저에게 전달하실 수 있습니다.</p>
                    <p className="c-gr">아래의 채팅창으로 메시지를 작성해 주시면, 빠른 시일 내 답변드리겠습니다.</p>
                </div>
            </div>
            <ChatDisplayContainer userId={userId} otherId={0}/>
        </div>
    )
}

export default ChatBox