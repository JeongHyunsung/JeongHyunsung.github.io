import '../../styles/App.css'
import '../../styles/editor.css'
import '../../styles/markdown.css'

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { useMediaQuery } from "react-responsive"

import mdParser from '../../utils/mdparser'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import 'highlight.js/styles/default.css'


function PostEditor({initialTitle, initialContent, onSubmit}){
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState(initialContent)
    const [tags, setTags] = useState([])

    useEffect(() => {
        setTitle(initialTitle)
        setContent(initialContent)
    }, [initialTitle, initialContent])

    const uploadImage = async (file)=>{
        const formData = new FormData()
        formData.append('file', file)
        const res = await axios.post('/api/post/image', formData)
        return res.data.url
    }
    const handleImageUpload = async (file)=>{
        const imgurl = await uploadImage(file)
        return imgurl
    }
    const handleContentChange = ({html, text}) =>{
        setContent(text)
    }
    const handleTitleChange = (e)=>{
        setTitle(e.target.value)
    }
    
    const handleSubmit = (event)=>{
        event.preventDefault();
        const data = {
            title: title,
            content: content,
        }
        onSubmit(data);
    }
    return(
        <div className="g-2r d-flex-c">
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
                    customHTMLRenderer={(html) => (
                        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
                    )}
                    onChange={handleContentChange}
                    onImageUpload={handleImageUpload}/>
            </div>
            <button className="editor-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PostEditor