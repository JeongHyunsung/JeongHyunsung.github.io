import '../../styles/App.css';
import '../../styles/localmenu.css'

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

function LocalMenu({menuArray}){
    const [isActive, setIsActive] = useState(false)
    const handleMenuEnter = (e)=>{
        console.log(e)
        setIsActive(true)
    }
    const handleMenuLeave = (e)=>{
        console.log(e)
        setIsActive(false)
    }
    return(
        <div className="fixed-container">
        <div 
            className="localmenu-container d-ac c-bddb"
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}>
            {isActive &&
            <div className="localmenu-active d-flex-c r-smooth-05 d-ac c-bdb">
                {menuArray.map((menu, index)=>{
                    if(menu.route){
                        return(
                            <Link to={menu.route} key={index.toString()} className="localmenu-menu c-bdb">
                                <p className="localmenu-text">{menu.text}</p>
                                <img className="localmenu-menuicon" src={menu.img} alt=""/>
                            </Link>
                        )
                    }
                    else{
                        return(
                            <div onClick={menu.onclick} key={index.toString()} className="localmenu-menu c-bdb cur-pt">
                                <p className="localmenu-text">{menu.text}</p>
                                <img className="localmenu-menuicon" src={menu.img} alt=""/>
                            </div>
                        )
                    }
                    
                })}
            </div>}
            {!isActive && <img className="localmenu-icon" src="/menu.svg" alt=""/>}
        </div>
        </div>
    )
}

export default LocalMenu