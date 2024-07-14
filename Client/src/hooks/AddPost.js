import '../styles/App.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

import PostEditor from './elements/PostEditor';

import history from '../utils/history'

function AddPost(){
    const navigate = useNavigate();
    /* tags 이용하여 tags-posts 테이블 업데이트 POST" */
    const handleSubmit = async (data, tags)=>{
        try{
            console.log(data)
            const res = await axios.post('/api/post/addpost', data);

            await Promise.all(tags.map((value)=>{
                axios.post('/api/post/posttagrel', {pid: res.data.pid, tid: value})
            }))
            navigate('/blog')
        }
        catch(error){
            console.log(error)
        }
    }
    return(
        <PostEditor
            initialTitle=""
            initialContent=""
            initialRptimgUrl=""
            initialTags={[]}
            onSubmit={handleSubmit}
        />
    )
}

export default AddPost