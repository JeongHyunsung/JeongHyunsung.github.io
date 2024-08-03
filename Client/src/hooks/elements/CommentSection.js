import '../../styles/App.css';

import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

function CommentSection({pid}){

    /* 새로운 댓글 submit 했을때, http post 하는 이벤트 핸들러 */
    

    /* pid 로 comment 불러오는 useEffect Hook*/
    const [comments, setComments] = useState([])
    /* comment format : [{cid:~, nickname:~, content:, parrent}, {}] */

    useEffect(()=>{
        const fetchComments = async ()=>{
            try{
                const res = await axios.get('/api/get/commentsinpost', {params: {post_id: pid}})
                setComments(res.data.rows)
            }
            catch(error){
                console.error("Error fetching comments in Card", error)
            }
            
        }
        fetchComments()
    }, [pid])

    return (
        <div className="comment-section">

        </div>
    )
}

export default CommentSection;

