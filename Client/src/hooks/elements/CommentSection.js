import '../../styles/App.css';
import '../../styles/comment.css';

import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import CommentEditor from './CommentEditor'

function CommentSection({pid}){

    /* 새로운 댓글 submit 했을때, http post 하는 이벤트 핸들러 */

    const [comments, setComments] = useState([])
    const [curSubmit, setCurSubmit] = useState(-1) /* -1이면 포스트에 대한 댓글, -1이 아니면 해당 cid를 가진 댓글에 대한 댓글 */

    /* comment format : [{cid:~, nickname:~, content:, parrent}, {}] */

    useEffect(()=>{
        const fetchComments = async ()=>{
            try{
                const res = await axios.get('/api/get/commentsinpost', {params: {pid: pid}})
                if(res.data){
                    setComments(res.data)
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
    }, [pid])

    return (
        <div className="comment-section w-100 d-flex-c g-1r">
            <div className="d-flex-r d-ac g-1r">
                <h1 className="comment-section-title c-wh">댓글</h1>
                <div className="comment-number-container d-flex-r d-ac d-jc c-bwh">
                    <h1 className="comment-number c-db">{comments.length}</h1>
                </div>
            </div>
            
            <div className="add-comment-section w-100 ">
                {curSubmit == -1 && <CommentEditor currentSubmit={curSubmit} pid={pid}/>}
            </div>
        </div>
    )
}

export default CommentSection;

