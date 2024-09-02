import '../../styles/App.css';
import '../../styles/comment.css';

import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import {toast} from 'react-toastify'

import { useSelector } from 'react-redux';


function CommentEditor({pid, toggle, curSubmit, setCurSubmit, level}){
    const userInfo = useSelector((state)=>state.auth.userInfo)
    const [content, setContent] = useState("")

    const handleContentChange = (e)=>{
        setContent(e.target.value)
    }
    const handleClearCurSubmit = (e)=>{
        setCurSubmit(null)
    }
    const handleCommentSubmit = async ()=>{
        if(!userInfo.userId){
            toast.warn("로그인이 필요한 기능입니다.")
            return
        }
        if(content){
            try{
                await axios.post('/comment/post/comment', {content: content, pid:pid, parentcid:curSubmit})
                toast.success("댓글이 성공적으로 제출되었습니다.")
                setCurSubmit(null)
                setContent("")
                toggle()
            }
            catch(error){
                toast.error("댓글 제출에 실패했습니다.")
            }
        }
        else{
            toast.warn("댓글은 내용이 있어야 합니다.")
        }
        return
    }

    return(
        <div 
            className="comment-editor d-flex-c g-05r c-bdb r-smooth-05"
            style={{marginLeft: level?40:0}}>
            <div className="d-flex-r d-ac d-jsb">
                <h2>댓글 작성하기</h2>
                {curSubmit &&
                <button className="comment-control-button" onClick={handleClearCurSubmit}>
                    <img className="comment-control-icon" src="/x.svg" alt="delete"/>    
                </button>}
            </div>
            <textarea className="comment-input big" value={content} onChange={handleContentChange} placeholder="댓글 *"/>
            <button className="comment-submit-button cur-pt" onClick={handleCommentSubmit}>댓글 제출</button>
        </div>
    )
}

export default CommentEditor;
