import '../../styles/App.css';
import '../../styles/comment.css';

import React, { useContext, useRef, useState, useEffect } from 'react';

import {toast} from 'react-toastify'
import dateConversion from '../../utils/dateConversion'
import axios from 'axios';

import { useSelector } from 'react-redux';

import CommentEditor from './CommentEditor'

function Comment({pid, cmt, toggle, curSubmit, setCurSubmit, level}){
    const convertedDate = dateConversion(cmt.created_at)
    const userInfo = useSelector((state)=>state.auth.userInfo)
    const handleCommentDelete = async ()=>{
        try{
            const confirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
            if (confirmed) {
                await axios.delete('/comment/delete/comment/'+ cmt.cid + '/' + cmt.uid)
                toggle()
            }  
        }catch(error){
            toast.error("Error delete comment")
        }
    }
    const handleCommentReply = ()=>{
        setCurSubmit(cmt.cid)
        return
    }
    return(
        <div 
            className="comment w-100 d-flex-c g-05r"
            style={{paddingLeft: (level)?20:0}}>
            <div className="comment-info-section d-flex-r d-ac g-1r">
                <div className="comment-profile-icon-container d-flex-r d-ac d-jc">
                    <img className="comment-profile-icon" src={cmt.pic} alt=""/>
                </div>
                <p>{cmt.name}</p>
                <p className="comment-date t-s c-gr">{convertedDate}</p>
                <div className="d-flex-r d-ac">
                    {userInfo.userId && 
                    <button className="comment-control-button" onClick={handleCommentReply}>
                        <img className="comment-control-icon" src="/comment.svg" alt="reply"/>    
                    </button>}
                    {userInfo.userId === cmt.uid && 
                    <button className="comment-control-button" onClick={handleCommentDelete}>
                        <img className="comment-control-icon" src="/x.svg" alt="delete"/>    
                    </button>}
                </div>
            </div>
            {cmt.content}
            <hr className="comment-hr w-100 c-bwh"></hr>
            {cmt.children.map((comment, index)=>{
                return <Comment key={comment.cid} pid={pid} toggle={toggle} cmt={comment} curSubmit={curSubmit} setCurSubmit={setCurSubmit} level={level+1}/>
            })}
            {curSubmit == cmt.cid && 
            <CommentEditor pid={pid} toggle={toggle} curSubmit={curSubmit} setCurSubmit={setCurSubmit} level={level+1}/>}
            
            
        </div>
    )
}

export default Comment