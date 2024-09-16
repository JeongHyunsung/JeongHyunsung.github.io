import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

function Proposal({}){
    const [detailDisplayed, setDetailDisplayed] = useState(false);

    const handleDetailClicked = ()=>{
        setDetailDisplayed(!detailDisplayed)
    }
    return(
        <div className="proposal d-flex-c">
            <div className="d-flex-r d-ac g-05r">
                <h1>제안하기</h1>
                <img className="details" src="/question.svg" onClick={handleDetailClicked}/>
            </div>
            <div className={`detail-container ${detailDisplayed ? 'expanded' : ''}`}>
                <p className="t-b">이곳에서는 프로젝트🚀, 창업🔥, 연구 아이디어✨에 대해 협업을 제안하실 수 있습니다. </p>
                <p className="c-gr">아래의 간단한 양식을 작성해 주시면, 제안해주신 내용을 검토한 후에 작성해주신 이메일로 빠른 시일 내 연락드리겠습니다. 소중한 시간 내어 주셔서 감사합니다!</p>
            </div>
            
        </div>
    )
}

export default Proposal