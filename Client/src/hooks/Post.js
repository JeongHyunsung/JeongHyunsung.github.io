import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { useParams } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"
import MarkdownIt from 'markdown-it'

function Post() {
  const params = useParams()
  const md = new MarkdownIt();
  const [post, setPost] = useState({
    pid: undefined,
    title: undefined,
    htmlcontent: undefined,
    upload_date: undefined,
    image_location: undefined,
    is_blog: undefined,
    fetched: false
  });

  useEffect(() => {
    axios.get('/api/get/post', { params: { post_id: params.pid } })
      .then(res => {
        const htmlcontent = md.render(res.data.rows[0].content)
        setPost({
          pid: res.data.rows[0].pid,
          title: res.data.rows[0].title,
          htmlcontent: <div dangerouslySetInnerHTML={{ __html: htmlcontent }} />,
          upload_date: res.data.rows[0].upload_date,
          image_location: res.data.rows[0].image_location,
          is_blog: res.data.rows[0].is_blog,
          fetched: true
        });
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="d-flex-r d-ac d-jc">
      {post.fetched &&
        <div className="w-80 d-flex-c">
          <hr className="c-bgr w-100"></hr>
          <h1>{post.title}</h1>
          <hr className="c-bgr w-100"></hr>
          <img src={post.image_location} alt="Post Image" />
          {post.htmlcontent}
          <p>{post.upload_date}</p>
        </div>
      }
    </div>
  );
}

export default Post;