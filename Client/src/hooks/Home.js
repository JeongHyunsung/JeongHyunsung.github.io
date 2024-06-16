import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Card({pid, title, content, imloc, rto}){
  const [isover, setIsover] = useState(false)
  const am_1 = "highlight-up"
  const am_2 = "highlight-down"
  
  return(
    <Link
      to = {"/post/"+pid}
      className="card w-100 d-flex-c p-rel d-ac d-jsa r-smooth-05 c-bwh c-ddb cur-pt" 
      style={{aspectRatio: rto,
              animation: (isover)?am_1:am_2,
              transform: (isover)?"translateY(-5px)":"none",
      }}
      onMouseOver={()=>{setIsover(true)}}
      onMouseLeave={()=>{setIsover(false)}}>
      <img className = "w-95 r-smooth-05" src={imloc}/>
      <h1>{title}</h1>
      <p>{content}</p>
    </Link>
  )
}

function Home(){
  console.log("Rendered")
  const isMobile = useMediaQuery({
    query : "(max-width:767px)"
  })
  const isPc = useMediaQuery({
    query : "(min-width:1024px)"
  });

  const num_columns = isMobile?1:(isPc?3:2)
  const wdh = ((102-(num_columns * 2))/num_columns).toString() + "%"

  const columns = Array.from({length: num_columns}, () => 0)

  const [dbPost, setDbPost] = useState([])
  const myfunc = ()=>{
    console.log("onfunc")
    console.log(dbPost)
    return 1
  }
  useEffect(() => {
    console.log('yyyy')
      axios.get('/api/get/post', {params: {post_id: -1}})
        .then(res => {
          let newData = res.data.rows.map(row=>({
            pid: row.pid,
            title: row.title,
            content: row.content,
            upload_date: row.upload_date,
            image_location: row.image_location,
            is_blog: row.is_blog
          }))
          setDbPost(newData)
        }).catch((err) => console.log(err) )}, [])

  return(
    <div className="Home d-flex-c">
      <div className="Intro d-flex-r">
        <h1 className= "c-wh"></h1>
      </div>
      <div className="recent-works d-flex-c text-spc">
        <hr className="c-bgr w-80"></hr>
        <h2 className="t-spacing c-wh t-bb t-light">Recent Works</h2>
        <div className="container-card d-flex-r w-80">
          {columns.map((_, i)=>{
            return (<div key={i} className="column-card d-flex-c" style={{width: wdh}}>
              {dbPost.filter((_, j)=>{
                if(j % num_columns == i) return true
                else return false
              }).map((data, k)=>{return (<Card key={data.pid} pid={data.pid} title={data.title} content={data.content} imloc={data.image_location} rto={0.8}/>)})}
            </div>)
          })}
        </div>
      </div>
    </div>
  )
}

export default Home