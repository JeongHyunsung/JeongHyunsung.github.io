import '../styles/App.css';

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import Card from "./elements/Card"


function Blog(){
    const isMobile = useMediaQuery({
        query : "(max-width:767px)"
    })
    const isPc = useMediaQuery({
        query : "(min-width:1024px)"
    })
    
    const num_columns = isMobile?1:(isPc?3:2)
    const wdh = ((102-(num_columns * 2))/num_columns).toString() + "%"
    const columns = Array.from({length: num_columns}, () => 0)
    const [dbPost, setDbPost] = useState([])
    useEffect(() => {
        const fetchBlogPosts = async()=>{
            try{
                const res = await axios.get('/api/get/post', {params: {post_id: -1}})
                let newData = res.data.rows.map(row=>({
                    pid: row.pid,
                    title: row.title,
                    content: row.content,
                    upload_date: row.upload_date,
                    image_location: row.image_location,
                    is_blog: row.is_blog
                }))
                setDbPost(newData)
            }
            catch(error){
                console.log(error)
            }
        }
        fetchBlogPosts()
    }, [])
    return (
        <div className="d-flex-c">
            <h1 className="t-bbb t-reg">BLOG</h1>
            <Link to="/addpost" className="addpost-button c-bwh"></Link>
            <div className="recent-works d-flex-c text-spc">
                <hr className="c-bgr w-100"></hr>
                <h2 className="t-spacing c-wh t-bb t-light">Recent Posts</h2>
                <div className="container-card d-flex-r">
                {columns.map((_, i)=>{
                    return (<div key={i} className="column-card d-flex-c" style={{width: wdh}}>
                    {dbPost.filter((_, j)=>{
                        if(j % num_columns == i) return true
                        else return false
                    }).map((data, k)=>{return (<Card key={data.pid} pid={data.pid} title={data.title} content={data.content} imloc={data.image_location}/>)})}
                    </div>)
                })}
                </div>
            </div>
        </div>
    )
}

export default Blog