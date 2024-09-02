import '../../styles/App.css'
import '../../styles/editor.css'
import '../../styles/markdown.css'

import 'react-markdown-editor-lite/lib/index.css'
import '../../styles/dracula.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { useMediaQuery } from "react-responsive"

import mdParser from '../../utils/mdparser'
import 'highlight.js/styles/default.css'
import MdEditor from 'react-markdown-editor-lite'


function PostEditor({initialTitle, initialContent, initialRptimgUrl, initialTags, onSubmit}){
    const [title, setTitle] = useState(initialTitle)
    const [content, setContent] = useState(initialContent)
    const [image, setImage] = useState(null)
    const [tag, setTag] = useState("")
    const [tags, setTags] = useState(initialTags)

    const imgfileName = image ? image.name : initialRptimgUrl;
    
    useEffect(() => {
        setTitle(initialTitle)
        setContent(initialContent)
        setTags(initialTags)
    }, [initialTitle, initialContent, initialTags])

    const uploadImage = async (file)=>{
        const formData = new FormData()
        formData.append('file', file)
        try{
            const res = await axios.post('/post/post/image', formData)
            return res.data.url
        }
        catch(error){
            console.error("Failed to upload image")
            return ""
        }
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
    const handleRptimgChange = (e)=>{
        const file = e.target.files[0]
        setImage(file)
    }
    const handleTagChange = (e)=>{
        setTag(e.target.value)
    }
    const handleTagDelete = (tid)=>{
        setTags(prevTags => prevTags.filter(tag_id=> tag_id[0] !== tid));
    }
    const handleTagSubmit = async ()=>{
        try{
            const res = await axios.post('/tag/post/tag', {tagname: tag})
            if(!tags.some(t => t[0] === res.data.tid)){
                setTags([...tags, [res.data.tid, tag]])
            }
            setTag("")
        }
        catch(error){
            console.error("Failed to add tag")
        }   
    }
    
    const handleSubmit = async (event)=>{
        event.preventDefault()
        let imgurl = initialRptimgUrl
        if (image){
            imgurl = await handleImageUpload(image)
        }
        const data = {
            title: title,
            content: content,
            imgurl: imgurl
        }
        onSubmit(data, tags);
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
            <div className="tags-section d-flex-r d-flex-wrap g-05r">
                {tags.map(([tid, tagname], index)=>{
                    return(
                        <div className="tag c-bdb c-wh d-flex-r d-jsb d-ac t-s t-reg" key={index.toString()}>
                            <p className="tagname">{tagname}</p>
                            <button className="tag-button c-bdb t-heavy d-flex-r d-jc d-ac" onClick={()=>handleTagDelete(tid)}>
                                <img className="icon-editor x" src="/x.svg" alt=""/>
                            </button>
                        </div>
                        
                    )
                })}
                <div className="tag c-bdb c-wh d-flex-r d-jsb d-ac">
                    <input className="tag-input c-bdb c-wh" type="text" value={tag} placeholder="Tag" onChange={handleTagChange}/>
                    <button className="tag-button c-bdb t-heavy d-flex-r d-jc d-ac" onClick={handleTagSubmit}>
                        <img className="icon-editor" src="/+.svg" alt=""/>
                    </button>
                </div>
            </div>
            <button className="editor-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PostEditor