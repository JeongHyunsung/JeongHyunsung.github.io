import '../styles/App.css'
import '../styles/editor.css'
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import Card from "./elements/Card"
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'

import history from '../utils/history';

function AddPost(){
    const context = useContext(Context)
    const mdParser = new MarkdownIt()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const handleContentChange = ({html, text}) =>{
        setContent(text)
        console.log(content)
    }
    const handleTitleChange = (e)=>{
        setTitle(e.target.value)
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        console.log(title, content)
        const data = {
            title: title,
            content: content,
        }
        axios.post('/api/post/posttodb', data)
            .then(response =>{
                console.log(response);
                setTimeout(() => history.replace('/'), 700)
            })
            .catch((err) => console.log(err))
    }
    return(
        <div className="editor-container d-flex-c">
            <input 
                className="title-input" 
                placeholder="Title" type="text" 
                value={title} 
                onChange={handleTitleChange}/>
            <div className="w-100">
                <MdEditor
                    className="editor"
                    value={content}
                    style={{ height: '500px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleContentChange}/>
            </div>
            <button className="editor-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default AddPost