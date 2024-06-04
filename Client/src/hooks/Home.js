import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'
import Context from '../utils/context'

import { useAuth0 } from "@auth0/auth0-react"

function Home(){
  const [data, setData] = useState("")
  useEffect(()=>{
    axios.get('/api/1').then(res => setData(res.data)).catch((error)=>{console.log(error)})
  })
  return(
    <div className="Cont0">
      <div className="Intro">
        <h1 >Hello, I'm</h1>
        <h1 className="grad">Hyunsung</h1>
        <h1 className="grad">Jeong</h1>
      </div>
      <p>There is no meaningless experience,</p>
      <p>So I try to <span className="pk">Learn various things</span> and <span className="pk">Apply them to world</span></p>
      <div className="recent-works">
        <h1>{data}</h1>
      </div>
    </div>
  )
}

export default Home