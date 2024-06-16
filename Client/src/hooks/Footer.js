import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import { Link } from 'react-router-dom';
import Context from '../utils/context'
import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

function Footer(){
  const isMobile = useMediaQuery({
    query : "(max-width:767px)"
  })
  const isPc = useMediaQuery({
    query : "(min-width:1024px)"
  });
  const isTablet = useMediaQuery({
    query : "(min-width:768px) and (max-width:1023px)"
  });
  

  return(
    <div className="Foot w-100 d-ac d-jsa d-flex-c c-bdb c-wh">
      <div className="icons w-100 d-flex-r d-ac d-jc">
        <a href="https://github.com/JeongHyunsung" target="_blank" rel="noopener noreferrer">
          <img className="icon" src="/github.svg" alt=""/>
        </a>
        <a href="https://www.linkedin.com/in/hyunsung-jeong-25a69030a/" target="_blank" rel="noopener noreferrer">
          <img className="icon" src="/linkedin.svg" alt=""/>
        </a>
        <a href="https://codeforces.com/profile/Hyunsung" target="_blank" rel="noopener noreferrer">
          <img className="icon" src="/codeforces.svg" alt=""/>
        </a>
      </div>
      
    </div>
  )
}
  


export default Footer