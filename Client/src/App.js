import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios'
/*https://www.freecodecamp.org/news/fullstack-react-blog-app-with-express-and-psql/ */


function Head({gs, sgs}){
  return(
    <div className="Head">
      <div className ="button" onClick={()=>{sgs(0)}}>
        <img className="icon" src="favicon.svg" alt=""/>
        {/*<p className="title">Hyunsung Jeong</p>*/}
      </div>
      <div className="global-nav">
        <NavButton nm="Blog" cur_num={1} gs={gs} sgs={sgs}/>
        <NavButton nm="Project" cur_num={2} gs={gs} sgs={sgs}/>
        <NavButton nm="About Me" cur_num={3} gs={gs} sgs={sgs}/>
      </div>
    </div>
  )
}

function NavButton({nm, cur_num, gs, sgs}){
  const [isover, setIsover] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const am_1 = "wider 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
  const am_2 = "narrower 0.1s cubic-bezier(0, 0.4, 0.6, 1)"
  return(
    <div 
      className="navigation-button"
      onMouseOver={()=>{setIsover(true);setIsInit(false)}}
      onMouseLeave={()=>{setIsover(false)}}
      onClick={()=>{sgs(cur_num)}}
      style={{top: (isover)?"-3px":"0px"}}>
      <p style={{color: (isover)?"var(--col-h1)":"var(--col-pp)",
                 fontWeight: (isover)?"600":"500"}}>
        {nm}
      </p>
      <div 
        className="underline"
        style={{animation:(!(isInit) && isover)?am_1:(!isInit)?am_2:"none",
                width:(isover)?"100%":"0%"}}></div>
    </div>
  )
}

function Content({gs, sgs}){
  return(
    <div className="Content">
      {gs===0 && <Cont0/>}
    </div>
  )
}

function Cont0(){
  const [data, setData] = useState("")
  useEffect(()=>{
    axios.get('/api/hello').then(res => setData(res.data))
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








function App() {
  const [globalState, setGlobalState] = useState(0)
  return (
    <div className="App">
      <Head gs={globalState} sgs={setGlobalState}/>
      <Content gs={globalState} sgs={setGlobalState}/>
    </div>
  );
}

export default App;
