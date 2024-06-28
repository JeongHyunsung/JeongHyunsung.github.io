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
      className="card w-100 d-flex-c d-ac p-rel r-smooth-05 c-bwh c-ddb cur-pt" 
      style={{animation: (isover)?am_1:am_2,
              transform: (isover)?"translateY(-5px)":"none",
      }}
      onMouseOver={()=>{setIsover(true)}}
      onMouseLeave={()=>{setIsover(false)}}>
      <div className= "card-content w-6px d-flex-c d-ac">
        <img className = "w-100 r-smooth-05" src={imloc}/>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
      
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
  const topClassName = isMobile?"w-80 d-flex-c d-ac":"w-80 d-flex-r d-ac d-jsb"

  const columns = Array.from({length: num_columns}, () => 0)

  const [dbPost, setDbPost] = useState([])
  const [isOver, setIsOver] = useState(false)
  const [effectBall, setEffectBall] = useState({x:0, y:0})
  const am_1 = "bigger 0.3s cubic-bezier(0, 0.4, 0.6, 1) forwards"

  const handleOver = (e)=>{
    if(isOver){return}
    setIsOver(true)
    const X = e.clientX
    const Y = e.clientY
    const circleElement = document.querySelector('.contact-button');
    const circleRect = circleElement.getBoundingClientRect();
    const relativeX = X - circleRect.left;
    const relativeY = Y - circleRect.top;
    setEffectBall({x:relativeX, y:relativeY})
  }
  const handleLeave = (e)=>{
    setIsOver(false)
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
      <div className={topClassName}>
        <div className="Intro d-flex-c w-50 d-al d-jc">
          <h1>Hello, I'm Hyunsung Jeong</h1>
          <p>I am a student majoring in electronic engineering</p>
          <p>with interests in <span className="c-lb">App/Web Development</span>,</p>
          <p><span className="c-lb">deep learning</span>, and <span className="c-lb">electronic circuits</span>. </p>
        </div>
        <Link className="contact-button c-wh" 
              to="/contact"
              onMouseOver={handleOver}
              onMouseLeave={handleLeave}
              style={{border:(isOver)?"3px solid var(--col-mb)":"3px solid var(--col-wh)"}}>
          <img className="icon" src="/email.svg" alt=""/>
          {isOver && 
            <div 
              className="effect-ball c-bmb"
              style={{left:effectBall.x, top:effectBall.y,
                      animation:(isOver)?am_1:"none"}}></div>}
        </Link>
      </div>
      
      <div className="recent-works d-flex-c text-spc">
        <hr className="c-bgr w-80"></hr>
        <h2 className="t-spacing c-wh t-bb t-light">Recent Posts</h2>
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