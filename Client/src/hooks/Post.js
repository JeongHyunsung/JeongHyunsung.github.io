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
    upload_date: undefined,
    image_location: undefined,
    is_blog: undefined,
    fetched: false
  });

  const handleEdit = ()=>{
    navigate('/editpost/'+post.pid)
  }

  const handleDelete = ()=>{
    axios.delete('/api/delete/post/'+params.pid)
      .then(response =>{
      console.log(response);
      setTimeout(() => navigate('/blog'), 700)
  })
  .catch((err) => console.log(err))
    navigate('/blog')
  }

  useEffect(() => {
    
    axios.get('/api/get/post', { params: { post_id: params.pid } })
      .then(res => {
        setPost({
          pid: res.data.rows[0].pid,
          title: (res.data.rows[0].title)?res.data.rows[0].title:"",
          content: (res.data.rows[0].content)?res.data.rows[0].content:"",
          upload_date: res.data.rows[0].upload_date,
          image_location: res.data.rows[0].image_location,
          is_blog: res.data.rows[0].is_blog,
          fetched: true
        });
        console.log(res.data.rows[0].image_location)
      })    
      .catch(err => console.log(err));
      
  }, []);

  return (
    <div>
      {post.fetched &&
        <React.Fragment>
          <div className="post d-flex-c">
            <hr className="c-bgr w-100"></hr>
            <h1>{post.title}</h1>
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