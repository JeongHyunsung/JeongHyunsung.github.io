import '../../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'

import Context from '../../utils/context'
import { Link } from 'react-router-dom'

import { useAuth0 } from "@auth0/auth0-react"

import { useMediaQuery } from "react-responsive"

import Card from "./Card"


function SearchResult({condition}){
    const [pids, setPids] = useState([])
    /* 검색 결과에 해당하는 post 들의 pid 리스트를 내부에 가지고 있으며, pid 리스트를 post cards 로 렌더링함 */
    /* db 전체 가져올 필요 없고, 특정 조건에 해당하는 포스트의 pid 만 http request 로 가져오면 됨 */
    /* condition 은 {search: {startdate: enddate: title: tag:[]}, sort{field: order: }} 형태임 */
    useEffect(()=>{
        const getSearchResultPids = async ()=>{여기부터 하면 댐
            try{
                const res = await axios.get(`/api/get/searchresult`, {params: condition})
                setPids(~~)
            }
            catch(error){console.log(error)}
        }
    })
    return(
        <div className="search-result">
            {pids.map((value)=>{
                return(<Card key = {value} pid = {value}/>)
            })}
        </div>
    )
}