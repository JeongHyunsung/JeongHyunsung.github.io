import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { useParams } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'

function Post() {
  const params = useParams()
  const mdParser = new MarkdownIt()
  const [post, setPost] = useState({
    pid: undefined,
    title: undefined,
    content: undefined,
    upload_date: undefined,
    image_location: undefined,
    is_blog: undefined,
    fetched: false
  });

  useEffect(() => {
    axios.get('/api/get/post', { params: { post_id: params.pid } })
      .then(res => {
        setPost({
          pid: res.data.rows[0].pid,
          title: res.data.rows[0].title,
          content: res.data.rows[0].content,
          upload_date: res.data.rows[0].upload_date,
          image_location: res.data.rows[0].image_location,
          is_blog: res.data.rows[0].is_blog,
          fetched: true
        });
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      {post.fetched &&
        <div className="post d-flex-c">
          <hr className="c-bgr w-100"></hr>
          <h1>{post.title}</h1>
          <p>{post.upload_date.substring(0, 10)}</p>
          <img src={post.image_location} alt="Post Image" />
          <hr className="w-100"></hr>
          <div dangerouslySetInnerHTML={{ __html: mdParser.render(post.content) }} />
        </div>
      }
    </div>
  );
}

export default Post;