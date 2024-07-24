import '../../styles/App.css';
import '../../styles/card.css';
import React, { useContext, useRef, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Card({pid}){
  // CardRef 에서 정확한 내부 높이 가져와야 하는데, ref가 되는 요소도 flexbox 이고 내부 element 중에서도 flex wrap 이 적용된 flexbox가 있어서 정확한 height 를 가져오기 힘든 상태
  const [isover, setIsover] = useState(false)
  const [post, setPost] = useState({title:"", imgurl:"", tags:[]})
  const [tagNames, setTagNames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [cardHeight, setCardHeight] = useState(50)
  const cardRef = useRef(null)
    
  const am_1 = "highlight-up"
  const am_2 = "highlight-down"

  useEffect(()=>{
    const fetchData = async () => {
      try{
        const res = await axios.get('/api/get/briefpost', {params: {post_id: pid}})
        const res_tags = await axios.get('/api/get/tagsinpost', {params: {post_id: pid}})
        setPost({
          title: res.data.rows[0].title,
          imgurl: res.data.rows[0].image_location,
          tags: res_tags.data.map(value=>{return value.tid})})
        console.log(res_tags.data.map(value=>{return value.tag_name}))
        setTagNames(res_tags.data.map(value=>{return value.tag_name}))
        setIsLoading(false)
      }
      catch(error){
        console.error("Error fetching post in Card", error)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [pid])

  useEffect(()=>{
    const updateCardHeight = ()=>{
      if(cardRef.current){
        let totalHeight = 0
        cardRef.current.childNodes.forEach(node => {
          console.log(node, node.offsetHeight)
          totalHeight += node.offsetHeight;
        })
        totalHeight += 20
        setCardHeight(totalHeight)
      }
    }
    updateCardHeight()
    const images = cardRef.current.querySelectorAll('img')
    images.forEach((image)=>{
      image.addEventListener('load', updateCardHeight)
    })
    window.addEventListener('resize', updateCardHeight)
    return ()=>{
      images.forEach((image)=>{
        image.removeEventListener('load', updateCardHeight)
      })
      window.removeEventListener('resize', updateCardHeight)
    }
  }, [post, isLoading])
  return(
    <Link
      to = {"/post/"+pid}
      className="card d-flex-c d-ac p-rel r-smooth-05 c-bdb c-wh cur-pt" 
      style={{animation: (isover)?am_1:am_2,
              transform: (isover)?"translateY(-5px)":"none",
              height: `${cardHeight}px`
      }}
      onMouseOver={()=>{setIsover(true)}}
      onMouseLeave={()=>{setIsover(false)}}
      ref={cardRef}>
      {isLoading? (
        <h1>. . .</h1>
      ):(
        <div className= "card-content w-6px d-flex-c g-05r d-ac">
          <img className = "w-100 r-smooth-05" src={post.imgurl}/>
          <h1 className = "t-heavy">{post.title}</h1>
          <div className="d-asfs d-flex-r d-flex-wrap g-05r">
            {tagNames.map((tagname, index)=>{
              return(
                <div className="tag c-bddb d-flex-r d-ac t-s t-reg" key={index.toString()}>
                  <p className="tagname c-wh t-s t-spacing-small">{tagname}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Link>
  )
}

export default Card
