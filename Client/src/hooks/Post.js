import '../styles/App.css';
import '../styles/markdown.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"
import mdParser from '../utils/mdparser'
import 'highlight.js/styles/default.css'

import history from '../utils/history'

function Post() {
  const params = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState({
    pid: undefined,
    title: '',
    content: '',
    tags: [],
    upload_date: undefined,
    image_location: undefined,
    is_blog: undefined,
    fetched: false
  });
  const [tagNames, setTagNames] = useState([])

  useEffect(()=>{
    const fetchTagNames = async()=>{
      try{
        const res = await Promise.all(post.tags.map(value=>{
          return axios.get(`/api/get/tag`, {params: {tid: value}})
        }))
        const names = res.map(r=>[r.data.rows[0].tid, r.data.rows[0].tag_name])
        setTagNames(names);
      }
      catch(error){console.error("Failed to fetch tag names")}}
    if(post.tags.length > 0){
      fetchTagNames()
    }
    else{
      setTagNames([])
    }
  }, [post.tags])

  useEffect(() => {
    const fetchPost = async() =>{
      try{
        const res = await axios.get('/api/get/post', { params: { post_id: params.pid } })
        const res_tags = await axios.get('/api/get/tagsinpost', {params: {post_id: params.pid}})
        setPost({
          pid: res.data.rows[0].pid,
          title: (res.data.rows[0].title)?res.data.rows[0].title:"",
          content: (res.data.rows[0].content)?res.data.rows[0].content:"",
          tags: res_tags.data.map(value=>{return value.tid}),
          upload_date: res.data.rows[0].upload_date,
          image_location: res.data.rows[0].image_location,
          is_blog: res.data.rows[0].is_blog,
          fetched: true
        });
      }
      catch(error){
        console.log(error)
      }
    }
    fetchPost()
  }, [post.pid]);

  const handleEdit = ()=>{
    navigate('/editpost/'+post.pid)
  }

  const handleDelete = async ()=>{
    try{
      const confirmed = window.confirm("정말로 이 포스트를 삭제하시겠습니까?");
      if (confirmed) {
        await axios.delete('/api/delete/post/' + params.pid);
        navigate('/blog');
      }
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div>
      {post.fetched &&
        <React.Fragment>
          <div className="post d-flex-c">
            <hr className="c-bgr w-100"></hr>
            <h1>{post.title}</h1>
            <div className="d-asfs d-flex-r d-flex-wrap g-05r">
              {tagNames.map(([_, tagname], index)=>{
                return(
                  <div className="tag c-bdb d-flex-r d-jsb d-ac t-s t-reg" key={index.toString()}>
                    <p className="tagname c-wh t-s t-spacing-small">{tagname}</p>
                  </div>
                )
              })}
            </div>
            <p>{post.upload_date.substring(0, 10)}</p>
            <div className="d-flex-r g-1r">
              <button className = "post-button c-bwh c-ddb" onClick={handleEdit}>Edit</button>
              <button className = "post-button c-bwh c-ddb" onClick={handleDelete}>Delete</button>
            </div>
            <img src={post.image_location} alt="Post Image" />
            <hr className="w-100"></hr>
            <div className="markdown" dangerouslySetInnerHTML={{ __html: mdParser.render(post.content) }} />
          </div>
        </React.Fragment>
      }
    </div>
  );
}

export default Post;