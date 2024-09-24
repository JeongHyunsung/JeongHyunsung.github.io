import '../../styles/App.css';
import '../../styles/contact.css';

import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';

import { Link } from 'react-router-dom'
import {toast} from 'react-toastify'
import { useMediaQuery } from "react-responsive"

import Message from './Message'

import dateConversion from '../../utils/dateConversion'

import { initializeSocket, getSocket } from '../../utils/socket'
import axios from 'axios';


function ChatDisplay({userId, otherId}){
    
    
    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState("")
    const messagesRef = useRef(null);

    useEffect(()=>{
        initializeSocket()
        const socket = getSocket()
        /* mid, uid_sender, uid_recipient, content, created_at */
        
        socket.on('message', (msg)=>{
            console.log("MESSAGE")
            if(msg.uid_sender == userId || msg.uid_recipient == userId){
                setMessages((prevMessages)=>[...prevMessages, msg])
            }
            
        })
        return ()=>{
            socket.off('message')
        }
    }, [userId])

    useEffect(()=>{
        const fetchMessages = async()=>{
            try{
                const res = await axios.get('/message/get/messagesfromuid', {params: {userId: userId, otherId: otherId}})
                setMessages(res.data)
            }catch(error){
                console.log(error)
                toast.error("Error Fetching Messages")
            }
        }
        fetchMessages()
    }, [userId])

    useEffect(() => {
        if(messagesRef.current){
            messagesRef.current.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: 'smooth', // 부드러운 스크롤
              });
        }
    }, [messages]);

    

    const handleMessageSend = ()=>{
        if(!messageInput){
            toast.warn("메시지는 내용이 있어야 합니다.")
            return
        }
        const socket = getSocket()
        /* uid 설정 로직 필요 */
        const newMessage = { content: messageInput, uid_sender: userId, uid_recipient: otherId }

        socket.emit('message', newMessage)
        setMessageInput('')
    }

    const handleMessageInputChanged = (e)=>{
        setMessageInput(e.target.value)
    }

    const renderedMessages = useMemo(()=>{
        return messages.map((msg)=>(
            <Message
                key={msg.mid}
                isSent={userId === msg.uid_sender}
                content={msg.content}
                createdAt={dateConversion(msg.created_at)}
            />
        ))
    }, [messages, userId])

    return(
        <div className="chatdisplay d-flex-c g-1r w-100">
            
            <div className="messages w-100" ref={messagesRef}>
                {renderedMessages}
            </div>
            <div className="message-input-container c-bwh c-ddb d-flex-r d-ac d-jsb">
                <input 
                    className="message-input"
                    type="text"
                    value={messageInput}
                    onChange={handleMessageInputChanged}
                    placeholder={messages.length == 0?"메시지를 입력해 문의를 시작하세요":""}/>
                <button
                    className="message-input-button"
                    onClick={handleMessageSend}><img className="send-icon" alt="" src="/send.svg"/></button>
            </div>
        </div>
    )
}

export default ChatDisplay
