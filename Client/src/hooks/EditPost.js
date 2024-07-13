import '../styles/App.css'
import '../styles/editor.css'
import '../styles/markdown.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { useNavigate, useParams, Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import 'react-markdown-editor-lite/lib/index.css'
import 'highlight.js/styles/default.css'

import PostEditor from './elements/PostEditor';


function EditPost(){
    const navigate = useNavigate()
    const params = useParams()
    const [post, setPost] = useState({title:"", content:""})

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const res = await axios.get('/api/get/post', {params: {post_id: params.pid}})
                setPost({title: res.data.rows[0].title, content: res.data.rows[0].content})
            }
                catch(error){
                console.error("Error fetching post", error)
            }
        }
        fetchData()
    }, [params.pid])
        

    const handleSubmit = (data)=>{
        data.pid = params.pid
        axios.post('/api/post/editpost', data)
            .then(response =>{
                console.log(response);
                setTimeout(() => navigate('/blog'), 700)
            })
            .catch((err) => console.log(err))
    }
    
    return(
        <PostEditor
            initialTitle={post.title}
            initialContent={post.content}
            onSubmit={handleSubmit}
        />
    )
}

export default EditPost