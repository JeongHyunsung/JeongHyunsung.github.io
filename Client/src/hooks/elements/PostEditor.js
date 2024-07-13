import '../../styles/App.css'
import '../../styles/editor.css'
import '../../styles/markdown.css'

import 'react-markdown-editor-lite/lib/index.css'
import 'highlight.js/styles/default.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { useMediaQuery } from "react-responsive"

import mdParser from '../../utils/mdparser'
import MdEditor from 'react-markdown-editor-lite'



function PostEditor({initialTitle, initialContent, onSubmit}){
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState(initialContent)
    const [image, setImage] = useState(null)
    const [tags, setTags] = useState([])

    const imgfileName = image ? image.name : '미리보기 이미지를 선택하세요';
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
        console.log(imgurl)
        return imgurl
    }
    const handleContentChange = ({html, text}) =>{
        setContent(text)
    }
    const handleTitleChange = (e)=>{
        setTitle(e.target.value)
    }
    const handleRptimgChange = (e)=>{
        const file = e.target.files[0]
        setImage(file)
    }
    
    const handleSubmit = async (event)=>{
        event.preventDefault()
        const imgurl = await handleImageUpload(image)
        const data = {
            title: title,
            content: content,
            imgurl: imgurl,
        }
        onSubmit(data);
    }
    return(
        <div className="posteditor g-2r d-flex-c">
            <input 
                className="title-input" 
                placeholder="Title" type="text"
                value={title} 
                onChange={handleTitleChange}/>
            <div className="d-flex-r d-ac">
                <input
                    className="rptimg-input"
                    type="file"
                    accept="image/*"
                    onChange={handleRptimgChange}/>
                <p className="t-ss">{imgfileName}</p>
            </div>
            
            
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
            <input 
                className="tags-input" 
                type="text"
                placeholder='#any_tag'/>
            <button className="editor-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PostEditor