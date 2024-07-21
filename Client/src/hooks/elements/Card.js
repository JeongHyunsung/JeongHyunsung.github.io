import '../../styles/App.css';
import '../../styles/card.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Card({pid}){
  const [isover, setIsover] = useState(false)
  const [post, setPost] = useState({title:"", imgurl:"", tags:[]})
  const [tagNames, setTagNames] = useState([])
    
  const am_1 = "highlight-up"
  const am_2 = "highlight-down"
    
  useEffect(()=>{
    const fetchTagNames = async()=>{
      try{
        const res = await Promise.all(post.tags.map(value=>{
          return axios.get(`/api/get/tag`, {params: {tid: value}})
        }))
        const names = res.map(r=>[r.data.rows[0].tid, r.data.rows[0].tag_name])
        setTagNames(names);
      }
      catch(error){console.error("Failed to fetch tag names")}}
      if(post.tags.length > 0){
        fetchTagNames()
      }
      else{
        setTagNames([])
      }
    }, [post.tags])
    
  useEffect(()=>{
    const fetchData = async () => {
      try{
        const res = await axios.get('/api/get/briefpost', {params: {post_id: pid}})
        const res_tags = await axios.get('/api/get/tagsinpost', {params: {post_id: pid}})
        setPost({
          title: res.data.rows[0].title,
          imgurl: res.data.rows[0].image_location,
          tags: res_tags.data.map(value=>{return value.tid})})
        }
        catch(error){console.error("Error fetching post in Card", error)}
    }
    fetchData()
  }, [pid])
  return(
    <Link
      to = {"/post/"+pid}
      className="card d-flex-c d-ac p-rel r-smooth-05 c-bdb c-wh cur-pt" 
      style={{animation: (isover)?am_1:am_2,
              transform: (isover)?"translateY(-5px)":"none",
      }}
      onMouseOver={()=>{setIsover(true)}}
      onMouseLeave={()=>{setIsover(false)}}>
      <div className= "card-content w-6px d-flex-c g-05r d-ac">
        <img className = "w-100 r-smooth-05" src={post.imgurl}/>
        <h1 className = "t-heavy">{post.title}</h1>
        <div className="d-asfs d-flex-r d-flex-wrap g-05r">
          {tagNames.map(([_, tagname], index)=>{
            return(
              <div className="tag c-bddb d-flex-r d-ac t-s t-reg" key={index.toString()}>
                <p className="tagname c-wh t-s t-spacing-small">{tagname}</p>
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export default Card
