import '../styles/App.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate, useParams, Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import PostEditor from './elements/PostEditor';

function EditPost(){

    const navigate = useNavigate()
    const params = useParams()
    const [post, setPost] = useState({title:"", content:"", imgurl:"", tags:[]})

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const res = await axios.get('/post/get/post', {params: {post_id: params.pid}})
                const res_tags = await axios.get('/rel/get/tagsinpost', {params: {post_id: params.pid}})
                setPost({
                    title: res.data.rows[0].title, 
                    content: res.data.rows[0].content, 
                    imgurl: res.data.rows[0].image_location,
                    tags: res_tags.data.map(value=>{return [value.tid, value.tag_name]})})
            }
            catch(error){
                console.error("Error fetching post", error)
            }
        }
        fetchData()
    }, [params.pid])
        
    /* 기본 relation 삭제 및 새로운 relation 추가 */

    const handleSubmit = async (data, tags)=>{
        data.pid = params.pid
        try{
            await axios.post('/post/post/editpost', data)
            await axios.delete('/rel/delete/resettagsinpost/' + params.pid)
            await Promise.all(tags.map(([value, _])=>{
                return axios.post('/rel/post/posttagrel', {pid: params.pid, tid: value})
            }))
            navigate('/blog')
        }
        catch(error){
            console.log(error)
        }
    }
    
    return(
        <PostEditor
            initialTitle={post.title}
            initialContent={post.content}
            initialRptimgUrl={post.imgurl}
            initialTags={post.tags}
            onSubmit={handleSubmit}
        />
    )
}

export default EditPost