import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"
import axios from 'axios';
import { toast } from 'react-toastify';

function Proposal({}){
    const [detailDisplayed, setDetailDisplayed] = useState(false);
    const [proposal, setProposal] = useState({title:"", email:"", description:""})

    const handleDetailClicked = ()=>{
        setDetailDisplayed(!detailDisplayed)
    }

    const handleEmailChange = (e)=>{
        setProposal(prev=>({...prev, email: e.target.value}))
    }
    const handleTitleChange = (e)=>{
        setProposal(prev=>({...prev, title: e.target.value}))
    }
    const handleDescriptionChange = (e)=>{
        setProposal(prev=>({...prev, description: e.target.value}))
    }

    const handleProposalSubmit = async ()=>{
        if(!(proposal.title && proposal.email)){
            toast.warn("이메일, 한줄 설명은 필수 항목입니다.")
            return
        }
        try{
            await axios.post('/proposal/post/proposal', proposal)
            setProposal({title:"", email:"", description:""})
        }catch(error){
            toast.error("Proposal Post Fail")
        }
    }

    return(
        <div className="proposal d-flex-c g-1r">
            <div className="chatbox-header">
                <div className="d-flex-r d-ac g-05r">
                    <h1>제안하기</h1>
                    <img className="details" src="/question.svg" onClick={handleDetailClicked}/>
                </div>
                <div className={`detail-container c-bddb ${detailDisplayed ? 'expanded' : ''}`}>
                    <p className="t-b">이곳에서는 프로젝트🚀, 창업🔥, 연구 아이디어✨에 대해 협업을 제안하실 수 있습니다. </p>
                    <p className="c-gr">아래의 간단한 양식을 작성해 주시면, 제안해주신 내용을 검토한 후에 작성해주신 이메일로 빠른 시일 내 연락드리겠습니다. 소중한 시간 내어 주셔서 감사합니다!</p>
                </div>
            </div>
            <div className="proposal-form c-bdb c-wh r-smooth-05">
                <div className="proposal-content d-flex-c g-1r">
                    <input className="proposal-text-input" type="text" placeholder="이메일 (추후 연락 용도)" value={proposal.email} onChange={handleEmailChange}/>
                    <input className="proposal-text-input" type="text" placeholder="프로젝트나 아이디어의 한줄 설명" value={proposal.title} onChange={handleTitleChange}/>
                    <textarea className="proposal-text-input big" placeholder="간략한 설명" value={proposal.description} onChange={handleDescriptionChange}/>
                    <button className="proposal-submit-button c-bwh" onClick={handleProposalSubmit}>제출</button>
                </div>
                
            </div>
        </div>
    )
}
export default Proposal