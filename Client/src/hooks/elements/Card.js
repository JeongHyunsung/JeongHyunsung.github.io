import '../../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../../utils/context'
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

export default Card
