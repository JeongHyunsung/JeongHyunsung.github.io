import '../../styles/App.css';
import '../../styles/comment.css';

import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import {toast} from 'react-toastify'

function CommentEditor({pid}){
    const [nickname, setNickname] = useState("")
    const [password, setPassword] = useState("")
    const [content, setContent] = useState("")
    const [isChecked, setIsChecked] = useState({cond1: false, cond2:false, cond3:false})

    const handleNicknameChange = (e)=>{
        setNickname(e.target.value)
    }
    const handlePasswordChange = (e)=>{
        setPassword(e.target.value)
    }
    const handleContentChange = (e)=>{
        setContent(e.target.value)
    }
    const handleCheck1Change = (e)=>{
        setIsChecked(prevCheck=>({...prevCheck, cond1: e.target.checked}))
    }
    const handleCheck2Change = (e)=>{
        setIsChecked(prevCheck=>({...prevCheck, cond2: e.target.checked}))
    }
    const handleCheck3Change = (e)=>{
        setIsChecked(prevCheck=>({...prevCheck, cond3: e.target.checked}))
    }
    const handleCommentSubmit = async ()=>{
        if(nickname && password.length && content && isChecked.cond1 && isChecked.cond2 && isChecked.cond3){
            if(password.length < 6){
                toast.warn("비밀번호는 6글자 이상이어야 합니다.")
                return
            }
            
            try{
                const data = {
                    nickname: nickname,
                    password: password,
                    content: content
                }
                const res = await axios.post('/api/post/comment', data)
                await axios.post('/api/post/postcommentrel', {pid: pid, cid: res.data.cid})
                toast.success("댓글이 성공적으로 제출되었습니다.")
            }
            catch(error){
                toast.error("댓글 제출에 실패했습니다.")
            }
        }
        else if(nickname && password && content){
            toast.warn("모든 확인 사항을 확인한 후 체크해 주세요.")
        }
        else{
            toast.warn("모든 필수 입력란을 입력해 주세요.")
        }
        return
    }

    return(
        <div className="comment-editor d-flex-c g-05r c-bdb r-smooth-05">
            <h2> 댓글 작성하기</h2>
            <div className="d-flex-r d-jsb d-ac">
                <input className="comment-input" type="text" value={nickname} onChange={handleNicknameChange} placeholder="닉네임 *"/>
                <input className="comment-input" type="password" value={password} onChange={handlePasswordChange} placeholder="6자리 이상의 비밀번호 *"/>
            </div>
            
            <textarea className="comment-input big" value={content} onChange={handleContentChange} placeholder="댓글 *"/>
            <div className="comment-checkbox-container d-flex-c">
                <div className="d-flex-r d-jsb d-ac g-2r">
                    <p>작성 내용이 민감한 개인정보를 포함하지 않으며, 댓글은 관리자 검토 후 게시됨을 확인했습니다.</p>
                    <input className="comment-checkbox" checked={isChecked.cond1} onChange={handleCheck1Change} type="checkbox"/>
                </div>
                <div className="d-flex-r d-jsb d-ac g-2r">
                    <p>작성 내용은 데이터베이스에 저장되며, 작성자는 언제든지 삭제 요청을 할 수 있음을 인지했습니다.</p>
                    <input className="comment-checkbox" checked={isChecked.cond2} onChange={handleCheck2Change} type="checkbox"/>
                </div>
                <div className="d-flex-r d-jsb d-ac g-2r">
                    <p>비밀번호는 댓글 삭제 및 수정 요청시 필요하며, 비밀번호를 기억했습니다.</p>
                    <input className="comment-checkbox" checked={isChecked.cond3} onChange={handleCheck3Change} type="checkbox"/>
                </div>
            </div>
            <p>본 사이트의 댓글 제출에 대한 더욱 자세한 처리 과정과 관련 정책은 <a className="c-mb" href="/privacy-policy" target="_blank">개인정보처리방침</a> 을 참고하세요.</p>
            <button className="comment-submit-button" onClick={handleCommentSubmit}>댓글 제출</button>
                

        </div>
    )
}

export default CommentEditor;
