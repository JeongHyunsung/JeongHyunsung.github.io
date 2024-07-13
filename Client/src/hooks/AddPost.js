import '../styles/App.css'
import '../styles/editor.css'
import '../styles/markdown.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import PostEditor from './elements/PostEditor';

import 'react-markdown-editor-lite/lib/index.css'
import 'highlight.js/styles/default.css'

import history from '../utils/history'

function AddPost(){
    const navigate = useNavigate();

    const handleSubmit = (data)=>{
        axios.post('/api/post/posttodb', data)
            .then(response =>{
                console.log(response);
                setTimeout(() => navigate('/'), 700)
            })
            .catch((err) => console.log(err))
    }
    return(
        <PostEditor
            initialTitle=""
            initialContent=""
            onSubmit={handleSubmit}
        />
    )
}

export default AddPost