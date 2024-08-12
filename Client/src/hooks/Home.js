import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import SearchResult from './elements/SearchResult'

function Home(){
  console.log("Rendered")
  const isMobile = useMediaQuery({
    query : "(max-width:767px)"
  })
  const topClassName = isMobile?"w-100 d-flex-c d-ac":"w-100 d-flex-r d-ac d-jsb"

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
  return(
    <div className="Home d-flex-c">
      <div className={topClassName}>
        <div className="Intro d-flex-c g-05r d-al d-jc">
          <h1>Hello, I'm Hyunsung Jeong</h1>
          <div d-flex-c d-al d-jc>
            <p>I am a student majoring in electronic engineering</p>
            <p>with interests in <span className="c-lb">App/Web Development</span>,</p>
            <p><span className="c-lb">deep learning</span>, and <span className="c-lb">electronic circuits</span>. </p>
          </div>
          </div>
        <Link className="contact-button c-wh" 
              to="/contact"
              onMouseOver={handleOver}
              onMouseLeave={handleLeave}>
          <img className="icon" src="/email.svg" alt=""/>
          {isOver && 
            <div 
              className="effect-ball c-bmb"
              style={{left:effectBall.x, top:effectBall.y,
                      animation:(isOver)?am_1:"none"}}></div>}
        </Link>
      </div>
      
      <div className="recent-works d-flex-c">
        <hr className="c-bgr w-100"/>
        <h2 className="t-spacing c-wh t-bb t-light">Recent Posts</h2>
        <SearchResult condition={{search: {}, sort: {field: "upload_date", order: "desc"}}}/>
      </div>
    </div>
  )
}

export default Home