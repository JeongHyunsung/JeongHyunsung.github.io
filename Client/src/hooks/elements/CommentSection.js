import '../../styles/App.css';
import '../../styles/comment.css';

import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import CommentEditor from './CommentEditor'
import Comment from './Comment'

const buildCommentTree = (comments)=>{
    const tree = []
    const lookup = {}
    comments.forEach(comment =>{
        lookup[comment.cid] = {...comment, children:[]}
    })
    comments.forEach(comment=>{
        if(comment.parent_cid){
            const parent = lookup[comment.parent_cid]
            if(parent){
                parent.children.push(lookup[comment.cid])
            }
        }
    })
    comments.forEach(comment=>{
        if(!comment.parent_cid){
            tree.push(lookup[comment.cid])
        }
    })
    return tree
}

function CommentSection({pid}){

    /* 새로운 댓글 submit 했을때, http post 하는 이벤트 핸들러 */

    const [comments, setComments] = useState([])
    const [commentsNum, setCommentsNum] = useState(0)
    const [curSubmit, setCurSubmit] = useState(null) 
    const [commentToggle, setCommentToggle] = useState(false)

    const toggleCommentToggle = ()=>{
        setCommentToggle(!commentToggle)
    }

    useEffect(()=>{
        const fetchComments = async ()=>{
            try{
                const res = await axios.get('/comment/get/commentsinpost', {params: {pid: pid}})
                if(res.data){
                    setComments(buildCommentTree(res.data))
                    setCommentsNum(res.data.length)
                }
                else{
                    setComments([])
                }
            }
            catch(error){
                console.error("Error fetching comments in Card", error)
            }
            
        }
        fetchComments()
    }, [pid, commentToggle])

    return (
        <div className="comment-section w-100 d-flex-c g-1r">
            <div className="d-flex-r d-ac g-1r">
                <h1 className="comment-section-title c-wh">댓글</h1>
                <div className="comment-number-container d-flex-r d-ac d-jc c-bwh">
                    <h1 className="comment-number c-db">{commentsNum}</h1>
                </div>
            </div>
            <div className="d-flex-c g-05r">
            {comments.map((comment, index)=>{
                return(
                    /*c.cid, c.content, c.created_at, c.parent_cid, u.name, u.pic, u.uid*/
                    <Comment key={comment.cid} pid={pid} toggle={toggleCommentToggle} cmt={comment} curSubmit={curSubmit} setCurSubmit={setCurSubmit} level={0}/>
                )
            })
            }
            </div>
            <div className="add-comment-section w-100 ">
                {!curSubmit && <CommentEditor pid={pid} toggle={toggleCommentToggle} curSubmit={curSubmit} setCurSubmit={setCurSubmit} level={0}/>}
            </div>
        </div>
    )
}

export default CommentSection;

