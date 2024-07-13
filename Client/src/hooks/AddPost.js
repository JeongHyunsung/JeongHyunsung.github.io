import '../styles/App.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useNavigate, Link } from 'react-router-dom'

import { useMediaQuery } from "react-responsive"

import PostEditor from './elements/PostEditor';

import history from '../utils/history'

function AddPost(){
    const navigate = useNavigate();

    const handleSubmit = (data)=>{
        axios.post('/api/post/addpost', data)
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